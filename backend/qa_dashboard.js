import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1/dashboard';
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
            body: JSON.stringify({ email: 'superadmin@nit.ac.in', password: 'SuperAdmin@123' })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        assert(token !== undefined, 'Authentication successful');

        log('--- Dashboard Overview ---');
        let t0 = performance.now();
        res = await fetch(`${API_BASE}/overview`, { headers });
        let t1 = performance.now();
        const overview = await res.json();
        assert(res.status === 200, `Overview status 200 (got ${res.status})`);
        assert(overview.success === true, 'Overview response structured correctly');
        assert(overview.data !== undefined, 'Overview data present');
        assert(t1 - t0 <= 300, `Overview performance: ${Math.round(t1 - t0)}ms`);

        log('--- Dashboard Live ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/live`, { headers });
        t1 = performance.now();
        const live = await res.json();
        console.log('LIVE DATA:', live);
        assert(res.status === 200, `Live status 200 (got ${res.status})`);
        assert(live.data !== undefined, 'Live data present');
        assert(Array.isArray(live.data?.latestAttendance) || Array.isArray(live.data?.attendance), 'Recent attendance is an array');
        assert(t1 - t0 <= 300, `Live performance: ${Math.round(t1 - t0)}ms`);

        log('--- Dashboard Filtered ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/filtered?department=invalidObjectId`, { headers });
        t1 = performance.now();
        const filteredInvalid = await res.json();
        console.log('FILTERED INVALID:', filteredInvalid);
        assert(res.status === 422 || res.status === 400, `Filtered validation for invalid ObjectId (got ${res.status})`);

        res = await fetch(`${API_BASE}/filtered`, { headers });
        const filtered = await res.json();
        assert(res.status === 200, `Filtered status 200 (got ${res.status})`);
        assert(filtered.data !== undefined, 'Filtered data present');

        log('--- Dashboard Live Attendance ---');
        res = await fetch(`${API_BASE}/live-attendance`, { headers });
        const liveAtt = await res.json();
        assert(res.status === 200, `Live Attendance status 200 (got ${res.status})`);

        log('--- Dashboard Device Status ---');
        res = await fetch(`${API_BASE}/device-status`, { headers });
        const devStatus = await res.json();
        assert(res.status === 200, `Device Status status 200 (got ${res.status})`);

        log('--- Dashboard Analytics ---');
        res = await fetch(`${API_BASE}/analytics`, { headers });
        const analytics = await res.json();
        assert(res.status === 200, `Analytics status 200 (got ${res.status})`);

        log(`\nDashboard QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
