import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1';

async function runQA() {
    let passed = 0;
    let failed = 0;
    const failures = [];

    const log = (msg) => console.log(msg);
    const assert = (condition, msg) => {
        if (condition) {
            passed++;
            log(`✅ PASS: ${msg}`);
        } else {
            failed++;
            log(`❌ FAIL: ${msg}`);
            failures.push(msg);
        }
    };

    try {
        log('--- Authentication ---');
        let res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@nit.ac.in', password: 'SuperAdmin@123' })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        // 1. Setup Department
        let deptsRes = await fetch(`${API_BASE}/departments`, { headers });
        let deptsData = await deptsRes.json();
        const deptId = deptsData?.data?.departments?.[0]?.id;

        // 2. Setup Device (Must be SecureEye for sync test)
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                deviceCode: `SYNCDEV${Date.now()}`,
                deviceName: 'Sync Test Device',
                deviceCategory: 'BIOMETRIC_TERMINAL',
                supportedVerificationMethods: ['FINGERPRINT'],
                manufacturer: 'SecureEye', // required for the SecureEyeProvider
                model: 'X100',
                serialNumber: `SSN${Date.now()}`,
                ipAddress: '192.168.1.100',
                port: 8080,
                building: 'Block A',
                floor: '1st',
                room: '101',
                assignedDepartment: deptId,
            })
        });
        const deviceData = await res.json();
        const deviceId = deviceData?.data?.id;

        log('--- Sync Trigger ---');
        const t0 = performance.now();
        res = await fetch(`${API_BASE}/sync/start`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ deviceId, provider: 'SecureEye' })
        });
        const t1 = performance.now();
        const syncRes = await res.json();
        console.log('SYNC RES:', syncRes);
        const jobId = syncRes?.data?.syncId;
        
        assert(res.status === 201 || res.status === 202, `Trigger Sync status ${res.status}`);
        assert(jobId !== undefined, 'Sync job ID returned successfully');
        assert(t1 - t0 <= 300, `Trigger performance: ${Math.round(t1 - t0)}ms`);

        // Duplicate trigger check
        res = await fetch(`${API_BASE}/sync/start`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ deviceId, provider: 'SecureEye' })
        });
        assert(res.status === 409 || res.status === 422, `Duplicate sync trigger rejected/handled (got ${res.status})`);

        log('--- Sync Status (State Machine) ---');
        // Give it 1 second to process the queue
        await new Promise(r => setTimeout(r, 1000));

        res = await fetch(`${API_BASE}/sync/${jobId}`, { headers });
        const jobData = await res.json();
        console.log('JOB DATA:', jobData);
        assert(res.status === 200, `Get Sync Job status 200`);
        assert(['SUCCESS', 'FAILED', 'RUNNING'].includes(jobData?.data?.status), `Job transitioned from PENDING correctly (status: ${jobData?.data?.status})`);

        log('--- Sync Retry ---');
        // If it failed (likely since we can't actually reach SecureEye), try to retry it
        if (jobData?.data?.status === 'FAILED') {
            res = await fetch(`${API_BASE}/sync/${jobId}/retry`, {
                method: 'POST',
                headers
            });
            assert(res.status === 202, `Retry Sync status 202 (got ${res.status})`);
        } else {
            log('⚠️ SKIP: Retry sync (job did not fail)');
        }

        log('--- Sync History ---');
        res = await fetch(`${API_BASE}/sync?deviceId=${deviceId}`, { headers });
        const histData = await res.json();
        console.log('HIST DATA:', histData);
        assert(res.status === 200, `List Sync History status 200`);
        assert(histData?.data?.history?.length > 0, `Sync history returned jobs`);

        res = await fetch(`${API_BASE}/sync/latest?deviceId=${deviceId}`, { headers });
        const latestData = await res.json();
        console.log('LATEST DATA:', latestData);
        assert(res.status === 200, `Latest Sync status 200`);
        assert(latestData?.data?.device?.id === deviceId, `Latest sync mapped to correct device`);

        log('--- Teardown ---');
        await fetch(`${API_BASE}/devices/${deviceId}`, { method: 'DELETE', headers });

        log(`\nSynchronization QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
