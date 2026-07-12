import 'dotenv/config';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1/reports';
const ROOT_API = 'http://localhost:5000/api/v1';

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
        let res = await fetch(`${ROOT_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: process.env.SUPER_ADMIN_EMAIL, password: process.env.SUPER_ADMIN_PASSWORD })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        assert(token !== undefined, 'Authentication successful');

        log('--- Attendance Reports ---');
        let t0 = performance.now();
        res = await fetch(`${API_BASE}/attendance`, { headers });
        let t1 = performance.now();
        let reportData = await res.json();
        console.log('ATTENDANCE REPORT DATA:', reportData);
        assert(res.status === 200, `Attendance Report status 200 (got ${res.status})`);
        assert(reportData.data?.data !== undefined, 'Attendance Report records present');
        assert(reportData.data?.summary !== undefined, 'Attendance Report summary present');
        assert(t1 - t0 <= 300, `Attendance Report performance: ${Math.round(t1 - t0)}ms`);

        // Test with invalid ObjectId in attendance report
        res = await fetch(`${API_BASE}/attendance?department=invalidId`, { headers });
        const invalidData = await res.json();
        console.log('INVALID DATA:', invalidData);
        assert(res.status === 400 || res.status === 422, `Invalid ObjectId handled in Attendance (got ${res.status})`);

        log('--- Faculty Reports ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/faculty`, { headers });
        t1 = performance.now();
        reportData = await res.json();
        assert(res.status === 200, `Faculty Report status 200 (got ${res.status})`);
        assert(reportData.data?.data !== undefined, 'Faculty Report records present');
        assert(reportData.data?.summary !== undefined, 'Faculty Report summary present');
        assert(t1 - t0 <= 300, `Faculty Report performance: ${Math.round(t1 - t0)}ms`);

        log('--- Device Reports ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/devices`, { headers });
        t1 = performance.now();
        reportData = await res.json();
        assert(res.status === 200, `Device Report status 200 (got ${res.status})`);
        assert(reportData.data?.data !== undefined, 'Device Report records present');
        assert(reportData.data?.summary !== undefined, 'Device Report summary present');
        assert(t1 - t0 <= 300, `Device Report performance: ${Math.round(t1 - t0)}ms`);

        log('--- Synchronization Reports ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/synchronization`, { headers });
        t1 = performance.now();
        reportData = await res.json();
        assert(res.status === 200, `Sync Report status 200 (got ${res.status})`);
        assert(reportData.data?.data !== undefined, 'Sync Report records present');
        assert(reportData.data?.summary !== undefined, 'Sync Report summary present');
        assert(t1 - t0 <= 300, `Sync Report performance: ${Math.round(t1 - t0)}ms`);

        log('--- Pagination & Filtering ---');
        res = await fetch(`${API_BASE}/faculty?page=1&limit=5&status=ACTIVE`, { headers });
        const pagedData = await res.json();
        assert(res.status === 200, `Pagination request status 200`);
        assert(pagedData.data?.pagination !== undefined, 'Pagination object present');
        assert(pagedData.data?.pagination?.page === 1, 'Pagination page matched');
        assert(pagedData.data?.pagination?.limit === 5, 'Pagination limit matched');

        log(`\nReports QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
