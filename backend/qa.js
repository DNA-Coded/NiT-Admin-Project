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
        // 1. Auth Login
        log('--- Authentication ---');
        let res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@nit.ac.in', password: 'SuperAdmin@123' })
        });
        const loginData = await res.json();
        const token = loginData?.data?.accessToken;
        assert(!!token, 'Got JWT Token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Setup Department
        let deptRes = await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: 'QA Department',
                code: 'QAD',
                description: 'For QA Testing'
            })
        });
        const deptData = await deptRes.json();
        let deptId = deptData?.data?.id;
        
        if (!deptId) {
            const existingDepts = await fetch(`${API_BASE}/departments?search=QAD`, { headers });
            const existingDeptsData = await existingDepts.json();
            if (existingDeptsData?.data?.departments && existingDeptsData.data.departments.length > 0) {
                deptId = existingDeptsData.data.departments[0].id;
            } else {
                console.log('Could not find existing dept:', JSON.stringify(existingDeptsData));
            }
        }
        assert(!!deptId, 'Department ID retrieved for testing');

        // 3. Faculty CRUD
        log('--- Faculty Create ---');
        const empId = `EMP${Date.now()}`;
        const newFaculty = {
            employeeId: empId,
            firstName: 'John',
            lastName: 'Doe',
            email: `john.${Date.now()}@test.com`,
            phone: '9876543210',
            designation: 'Assistant Professor',
            department: deptId,
            joiningDate: '2023-01-01',
            status: 'ACTIVE',
            attendanceIdentity: `BIO${Date.now()}`
        };

        const t0 = performance.now();
        res = await fetch(`${API_BASE}/faculty`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newFaculty)
        });
        const t1 = performance.now();
        const createData = await res.json();
        
        if (res.status !== 201) console.log('Create Faculty Failed:', JSON.stringify(createData));
        assert(res.status === 201, `Create Faculty status 201 (got ${res.status})`);
        assert(createData?.data?.id, 'Faculty created successfully');
        assert(t1 - t0 <= 300, `Create performance: ${Math.round(t1 - t0)}ms`);

        const facultyId = createData?.data?.id;

        // Duplicate checks
        res = await fetch(`${API_BASE}/faculty`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newFaculty)
        });
        assert(res.status === 409 || res.status === 400 || res.status === 422, `Duplicate Employee ID rejected (status ${res.status})`);

        // GET by ID
        res = await fetch(`${API_BASE}/faculty/${facultyId}`, { headers });
        const getData = await res.json();
        assert(res.status === 200, `Get Faculty by ID status 200`);
        assert(getData?.data?.firstName === 'John', 'Get Faculty returns correct data');

        // Search & Pagination
        const t2 = performance.now();
        res = await fetch(`${API_BASE}/faculty?search=${empId}&page=1&limit=10`, { headers });
        const t3 = performance.now();
        const searchData = await res.json();
        assert(res.status === 200, 'Search and Pagination successful');
        assert(searchData?.data?.faculty?.length > 0, 'Search returned results');
        assert(t3 - t2 <= 300, `Search performance: ${Math.round(t3 - t2)}ms`);

        // Validation - Missing fields
        res = await fetch(`${API_BASE}/faculty`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ firstName: 'Incomplete' })
        });
        assert(res.status === 422, `Validation missing fields (status ${res.status})`);

        // NoSQL injection test
        res = await fetch(`${API_BASE}/faculty`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ "employeeId": { "$gt": "" } })
        });
        assert(res.status === 422 || res.status === 400, `NoSQL Injection rejected (status ${res.status})`);

        // Update
        const t4 = performance.now();
        res = await fetch(`${API_BASE}/faculty/${facultyId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ firstName: 'Johnny' })
        });
        const t5 = performance.now();
        const updateData = await res.json();
        if (res.status !== 200) console.log('Update Faculty Failed:', JSON.stringify(updateData));
        assert(res.status === 200, `Update status 200`);
        assert(updateData?.data?.firstName === 'Johnny', 'Update saved correctly');
        assert(updateData?.data?.employeeId === empId, 'Partial update preserves existing values');
        assert(t5 - t4 <= 300, `Update performance: ${Math.round(t5 - t4)}ms`);

        // Delete (Soft Delete)
        res = await fetch(`${API_BASE}/faculty/${facultyId}`, {
            method: 'DELETE',
            headers
        });
        assert(res.status === 200, `Delete status 200`);

        // Verify Delete (soft deleted should still be retrievable by admin, but isActive should be false)
        res = await fetch(`${API_BASE}/faculty/${facultyId}`, { headers });
        const deletedData = await res.json();
        assert(res.status === 200 && deletedData?.data?.isActive === false, `Soft deleted faculty fetched successfully and is inactive`);
        
        // Restore
        res = await fetch(`${API_BASE}/faculty/${facultyId}/restore`, {
            method: 'PATCH',
            headers
        });
        assert(res.status === 200, `Restore status 200`);

        // Verify restored
        res = await fetch(`${API_BASE}/faculty/${facultyId}`, { headers });
        assert(res.status === 200, `Restored faculty found normally`);

        log(`\nQA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
