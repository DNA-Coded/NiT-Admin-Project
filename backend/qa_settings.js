import 'dotenv/config';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1/settings';
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
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        assert(token !== undefined, 'Authentication successful');

        log('--- Singleton & Fetch ---');
        let t0 = performance.now();
        res = await fetch(`${API_BASE}`, { headers });
        let t1 = performance.now();
        const getRes = await res.json();
        assert(res.status === 200, `Get settings status 200 (got ${res.status})`);
        assert(getRes.data !== undefined && !Array.isArray(getRes.data), 'Returns a single settings document');
        assert(t1 - t0 <= 300, `Get performance: ${Math.round(t1 - t0)}ms`);

        log('--- Partial Updates ---');
        const updatePayload = {
            attendance: {
                gracePeriodMinutes: 30
            }
        };
        t0 = performance.now();
        res = await fetch(`${API_BASE}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatePayload)
        });
        t1 = performance.now();
        const updateRes = await res.json();
        console.log('UPDATE RES:', updateRes);
        assert(res.status === 200, `Update settings status 200 (got ${res.status})`);
        assert(updateRes.data?.attendance?.gracePeriodMinutes === 30, 'Nested value updated correctly');
        assert(t1 - t0 <= 300, `Update performance: ${Math.round(t1 - t0)}ms`);

        // Check if other fields are preserved
        assert(updateRes.data?.system?.timezone !== undefined, 'Other fields are preserved during partial update');

        log('--- Validation ---');
        const invalidPayload = {
            attendance: {
                gracePeriodMinutes: -5 // Invalid number
            }
        };
        res = await fetch(`${API_BASE}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(invalidPayload)
        });
        assert(res.status === 400 || res.status === 422, `Invalid update rejected (got ${res.status})`);

        log('--- Security & Authorization ---');
        res = await fetch(`${API_BASE}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }, // Missing JWT
            body: JSON.stringify(updatePayload)
        });
        assert(res.status === 401, `Missing JWT rejected (got ${res.status})`);

        log('--- Reset Settings ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}/reset`, {
            method: 'POST',
            headers
        });
        t1 = performance.now();
        const resetRes = await res.json();
        assert(res.status === 200, `Reset settings status 200 (got ${res.status})`);
        assert(resetRes.data?.attendance?.gracePeriodMinutes === 15, 'Grace period reset to default (15)');
        assert(t1 - t0 <= 300, `Reset performance: ${Math.round(t1 - t0)}ms`);

        log('--- Activity Logging ---');
        res = await fetch(`${ROOT_API}/activity?limit=10`, { headers });
        const activityRes = await res.json();
        console.log('ACTIVITY LOG:', activityRes.data.map(a => ({ module: a.module, action: a.action, performedBy: a.performedBy })));
        const updateActivity = activityRes.data.find(a => a.action === 'UPDATE' && a.module === 'SETTINGS');
        const resetActivity = activityRes.data.find(a => a.action === 'RESET' && a.module === 'SETTINGS');
        assert(updateActivity !== undefined, 'Settings Updated activity recorded');
        assert(resetActivity !== undefined, 'Settings Reset activity recorded');
        if (updateActivity) {
            assert(updateActivity.performedBy !== undefined, 'Correct admin recorded for update');
            assert(updateActivity.createdAt !== undefined, 'Timestamp recorded for update');
        }

        log(`\nSettings QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
