import 'dotenv/config';
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
            body: JSON.stringify({ email: process.env.SUPER_ADMIN_EMAIL, password: process.env.SUPER_ADMIN_PASSWORD })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        // Get a dept
        const existingDepts = await fetch(`${API_BASE}/departments`, { headers });
        const existingDeptsData = await existingDepts.json();
        const deptId = existingDeptsData?.data?.departments?.[0]?.id;

        // Create Device
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                deviceCode: `HDVC${Date.now()}`,
                deviceName: 'Health Test',
                deviceCategory: 'BIOMETRIC_TERMINAL',
                supportedVerificationMethods: ['FINGERPRINT'],
                manufacturer: 'SecureEye',
                model: 'X100',
                serialNumber: `HSN${Date.now()}`,
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

        // Health Update
        const t0 = performance.now();
        res = await fetch(`${API_BASE}/health/${deviceId}/heartbeat`, {
            method: 'PATCH',
            headers
        });
        const t1 = performance.now();
        assert(res.status === 200, `Heartbeat status 200 (got ${res.status})`);
        assert(t1 - t0 <= 300, `Health update performance: ${Math.round(t1 - t0)}ms`);

        res = await fetch(`${API_BASE}/health/${deviceId}`, { headers });
        let hd = await res.json();
        console.log("HEALTH DATA: ", hd);
        assert(hd?.data?.healthStatus === 'HEALTHY', 'Health status transitioned to HEALTHY');
        
        // Record Error
        res = await fetch(`${API_BASE}/health/${deviceId}/error`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ error: 'Lost connection' })
        });
        assert(res.status === 200, 'Error recorded successfully');

        res = await fetch(`${API_BASE}/health/${deviceId}`, { headers });
        hd = await res.json();
        assert(hd?.data?.failureCount === 1, 'Failure counter incremented');
        assert(hd?.data?.healthStatus === 'ERROR', 'Health status transitioned to ERROR');
        
        // Delete device
        await fetch(`${API_BASE}/devices/${deviceId}`, { method: 'DELETE', headers });

        log(`\nHealth QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
