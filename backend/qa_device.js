import 'dotenv/config';
import fs from 'fs';
import path from 'path';

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
        assert(!!token, 'Got JWT Token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 1. Setup Department
        let deptRes = await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: 'Device QA Dept', code: 'DEVQA' })
        });
        let deptData = await deptRes.json();
        let deptId = deptData?.data?.id;
        if (!deptId) {
            const existingDepts = await fetch(`${API_BASE}/departments?search=DEVQA`, { headers });
            const existingDeptsData = await existingDepts.json();
            deptId = existingDeptsData?.data?.departments?.[0]?.id;
        }
        assert(!!deptId, 'Department ID retrieved for testing');

        // 2. Device CRUD
        log('--- Device Create ---');
        const deviceCode = `DVC${Date.now()}`;
        const serialNumber = `SN${Date.now()}`;
        const newDevice = {
            deviceCode,
            deviceName: 'Test Biometric',
            deviceCategory: 'BIOMETRIC_TERMINAL',
            supportedVerificationMethods: ['FINGERPRINT', 'FACE_RECOGNITION'],
            manufacturer: 'SecureEye',
            model: 'X100',
            serialNumber,
            ipAddress: '192.168.1.100',
            macAddress: '00:1B:44:11:3A:B7',
            port: 8080,
            building: 'Block A',
            floor: '1st',
            room: '101',
            assignedDepartment: deptId,
            connectionMode: 'LAN',
            heartbeatInterval: 5
        };

        const t0 = performance.now();
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newDevice)
        });
        const t1 = performance.now();
        const createData = await res.json();
        if (res.status !== 201) console.log('Create Device Failed:', JSON.stringify(createData));
        assert(res.status === 201, `Create Device status 201 (got ${res.status})`);
        assert(createData?.data?.id, 'Device created successfully');
        assert(t1 - t0 <= 300, `Create performance: ${Math.round(t1 - t0)}ms`);

        const deviceId = createData?.data?.id;

        // Duplicate checks
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newDevice)
        });
        assert(res.status === 409 || res.status === 400 || res.status === 422, `Duplicate Device Code/Serial rejected (status ${res.status})`);

        // GET by ID
        res = await fetch(`${API_BASE}/devices/${deviceId}`, { headers });
        const getData = await res.json();
        assert(res.status === 200, `Get Device by ID status 200`);
        assert(getData?.data?.deviceName === 'Test Biometric', 'Get Device returns correct data');

        // Search & Pagination
        const t2 = performance.now();
        res = await fetch(`${API_BASE}/devices?search=${deviceCode}&page=1&limit=10`, { headers });
        const t3 = performance.now();
        const searchData = await res.json();
        assert(res.status === 200, 'Search and Pagination successful');
        assert(searchData?.data?.devices?.length > 0, 'Search returned results');
        assert(t3 - t2 <= 300, `Search performance: ${Math.round(t3 - t2)}ms`);

        // Validation - Missing fields
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ deviceName: 'Incomplete' })
        });
        assert(res.status === 422, `Validation missing fields (status ${res.status})`);

        // NoSQL injection test
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ "deviceCode": { "$gt": "" } })
        });
        assert(res.status === 422 || res.status === 400, `NoSQL Injection rejected (status ${res.status})`);

        // Update
        const t4 = performance.now();
        res = await fetch(`${API_BASE}/devices/${deviceId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ deviceName: 'Test Biometric Updated' })
        });
        const t5 = performance.now();
        const updateData = await res.json();
        if (res.status !== 200) console.log('Update Device Failed:', JSON.stringify(updateData));
        assert(res.status === 200, `Update status 200 (got ${res.status})`);
        assert(updateData?.data?.deviceName === 'Test Biometric Updated', 'Update saved correctly');
        assert(updateData?.data?.deviceCode === deviceCode, 'Partial update preserves existing values');
        assert(t5 - t4 <= 300, `Update performance: ${Math.round(t5 - t4)}ms`);

        // Status Update
        res = await fetch(`${API_BASE}/devices/${deviceId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: 'MAINTENANCE' })
        });
        assert(res.status === 200, `Status update status 200 (got ${res.status})`);
        let statusData = await res.json();
        assert(statusData?.data?.status === 'MAINTENANCE', 'Status changed successfully');

        // Delete (Soft Delete)
        res = await fetch(`${API_BASE}/devices/${deviceId}`, {
            method: 'DELETE',
            headers
        });
        assert(res.status === 200, `Delete status 200 (got ${res.status})`);

        // Restore
        res = await fetch(`${API_BASE}/devices/${deviceId}/restore`, {
            method: 'PATCH',
            headers
        });
        assert(res.status === 200, `Restore status 200 (got ${res.status})`);

        log(`\nQA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
