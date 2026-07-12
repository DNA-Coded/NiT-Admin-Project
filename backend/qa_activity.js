import 'dotenv/config';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1/activity';
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
        log('--- Authentication Validation ---');
        let res = await fetch(`${API_BASE}`);
        assert(res.status === 401, `Missing JWT rejected (got ${res.status})`);

        res = await fetch(`${API_BASE}`, { headers: { 'Authorization': 'Bearer invalid_token' } });
        assert(res.status === 401, `Invalid JWT rejected (got ${res.status})`);

        log('--- Authentication ---');
        res = await fetch(`${ROOT_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: process.env.SUPER_ADMIN_EMAIL, password: process.env.SUPER_ADMIN_PASSWORD })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        const headers = { 'Authorization': `Bearer ${token}` };
        assert(token !== undefined, 'Authentication successful');

        log('--- Fetch & Timeline ---');
        let t0 = performance.now();
        res = await fetch(`${API_BASE}?limit=50`, { headers });
        let t1 = performance.now();
        const data = await res.json();
        assert(res.status === 200, `Timeline fetch status 200 (got ${res.status})`);
        assert(Array.isArray(data.data), 'Timeline returns array of activities');
        assert(data.pagination !== undefined, 'Pagination metadata present');
        assert(t1 - t0 <= 300, `Timeline performance: ${Math.round(t1 - t0)}ms`);

        if (Array.isArray(data.data) && data.data.length >= 2) {
            const firstDate = new Date(data.data[0].createdAt).getTime();
            const secondDate = new Date(data.data[1].createdAt).getTime();
            assert(firstDate >= secondDate, 'Activities are ordered latest first');
        }

        log('--- Filtering ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/filter?module=AUTH`, { headers });
        t1 = performance.now();
        const filteredData = await res.json();
        assert(res.status === 200, `Filter status 200 (got ${res.status})`);
        assert(Array.isArray(filteredData.data), 'Filter returns array');
        const allAuth = filteredData.data?.every(a => a.module === 'AUTH') ?? false;
        assert(allAuth, 'All filtered results match AUTH module');
        assert(t1 - t0 <= 300, `Filter performance: ${Math.round(t1 - t0)}ms`);

        log('--- Search ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/search?q=admin`, { headers });
        t1 = performance.now();
        const searchData = await res.json();
        assert(res.status === 200, `Search status 200 (got ${res.status})`);
        assert(Array.isArray(searchData.data), 'Search returns array');
        assert(t1 - t0 <= 300, `Search performance: ${Math.round(t1 - t0)}ms`);

        log('--- Security: Sensitive Data Scanning ---');
        const rawResponse = JSON.stringify(data.data);
        const hasBcrypt = /\$2[abxy]\$\d+/.test(rawResponse);
        const hasSecret = rawResponse.includes('JWT_SECRET');
        assert(!hasBcrypt, 'No Bcrypt hashes found in activity data');
        assert(!hasSecret, 'No JWT secrets found in activity data');

        log(`\nActivity QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
