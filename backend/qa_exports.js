import fs from 'fs';

const API_BASE = 'http://localhost:5000/api/v1/exports';
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
        const headers = { 'Authorization': `Bearer ${token}` };
        assert(token !== undefined, 'Authentication successful');

        log('--- CSV Export ---');
        let t0 = performance.now();
        res = await fetch(`${API_BASE}?report=attendance&format=csv`, { headers });
        let t1 = performance.now();
        assert(res.status === 200, `CSV Export status 200 (got ${res.status})`);
        assert(res.headers.get('content-type')?.includes('text/csv'), 'CSV Content-Type correct');
        assert(res.headers.get('content-disposition')?.includes('.csv'), 'CSV Content-Disposition filename correct');
        const csvBuffer = await res.arrayBuffer();
        assert(csvBuffer.byteLength > 0, 'CSV Buffer not empty');
        assert(t1 - t0 <= 1000, `CSV Export performance: ${Math.round(t1 - t0)}ms`);

        log('--- Excel Export ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}?report=faculty&format=xlsx`, { headers });
        t1 = performance.now();
        assert(res.status === 200, `Excel Export status 200 (got ${res.status})`);
        assert(res.headers.get('content-type')?.includes('spreadsheetml'), 'Excel Content-Type correct');
        assert(res.headers.get('content-disposition')?.includes('.xlsx'), 'Excel Content-Disposition filename correct');
        const xlsxBuffer = await res.arrayBuffer();
        assert(xlsxBuffer.byteLength > 0, 'Excel Buffer not empty');

        log('--- PDF Export ---');
        t0 = performance.now();
        res = await fetch(`${API_BASE}?report=devices&format=pdf`, { headers });
        t1 = performance.now();
        assert(res.status === 200, `PDF Export status 200 (got ${res.status})`);
        assert(res.headers.get('content-type')?.includes('application/pdf'), 'PDF Content-Type correct');
        assert(res.headers.get('content-disposition')?.includes('.pdf'), 'PDF Content-Disposition filename correct');
        const pdfBuffer = await res.arrayBuffer();
        assert(pdfBuffer.byteLength > 0, 'PDF Buffer not empty');
        
        log('--- Invalid Export ---');
        res = await fetch(`${API_BASE}?report=invalid&format=csv`, { headers });
        assert(res.status === 400 || res.status === 422, `Invalid report type rejected (got ${res.status})`);
        
        res = await fetch(`${API_BASE}?report=attendance&format=invalid`, { headers });
        assert(res.status === 400 || res.status === 422, `Invalid format type rejected (got ${res.status})`);

        log(`\nExport QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
