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

        // 1. Setup Department
        let deptsRes = await fetch(`${API_BASE}/departments`, { headers });
        let deptsData = await deptsRes.json();
        const deptId = deptsData?.data?.departments?.[0]?.id;

        // 2. Setup Faculty
        const empId = `FAC${Date.now()}`;
        res = await fetch(`${API_BASE}/faculty`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                employeeId: empId,
                firstName: 'Att',
                lastName: 'QA',
                email: `attqa${Date.now()}@nit.ac.in`,
                phone: `999${Math.floor(1000000 + Math.random() * 9000000)}`,
                designation: 'Professor',
                department: deptId,
                attendanceIdentity: `ID${Date.now()}`,
                status: 'ACTIVE',
                joiningDate: '2020-01-01'
            })
        });
        const facultyData = await res.json();
        console.log('FACULTY RES:', facultyData);
        const facultyId = facultyData?.data?.id;

        // 3. Setup Device
        res = await fetch(`${API_BASE}/devices`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                deviceCode: `ATTDEV${Date.now()}`,
                deviceName: 'Att Test Device',
                deviceCategory: 'BIOMETRIC_TERMINAL',
                supportedVerificationMethods: ['FINGERPRINT'],
                manufacturer: 'SecureEye',
                model: 'X100',
                serialNumber: `ASN${Date.now()}`,
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

        log('--- Attendance Create ---');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toISOString().split('T')[1].split('.')[0];
        const attCode = `ATT${Date.now()}`;

        const attPayload = {
            attendanceCode: attCode,
            personType: 'FACULTY',
            person: facultyId,
            device: deviceId,
            attendanceIdentity: facultyData?.data?.attendanceIdentity,
            verificationMethod: 'FINGERPRINT',
            attendanceType: 'CHECK_IN',
            timestamp: now.toISOString(),
            attendanceDate: dateStr,
            attendanceTime: timeStr,
            status: 'PRESENT',
            remarks: 'Test check in'
        };

        const t0 = performance.now();
        res = await fetch(`${API_BASE}/attendance`, {
            method: 'POST',
            headers,
            body: JSON.stringify(attPayload)
        });
        const t1 = performance.now();
        const attRes = await res.json();
        console.log("Create Attendance Res:", attRes);
        const attId = attRes?.data?.id;
        assert(res.status === 201, `Create Attendance status 201 (got ${res.status})`);
        assert(attId !== undefined, 'Attendance record created successfully');
        assert(t1 - t0 <= 300, `Create performance: ${Math.round(t1 - t0)}ms`);

        log('--- Business Rules ---');
        // Duplicate check
        res = await fetch(`${API_BASE}/attendance`, {
            method: 'POST',
            headers,
            body: JSON.stringify(attPayload)
        });
        assert(res.status === 409, `Duplicate attendance rejected (got ${res.status})`);

        // Consecutive CHECK_IN rejection (Optional logic, let's see if 400/409/422)
        const nextTime = new Date(now.getTime() + 60000);
        res = await fetch(`${API_BASE}/attendance`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...attPayload,
                attendanceCode: `ATT${Date.now()}`,
                timestamp: nextTime.toISOString(),
                attendanceTime: nextTime.toISOString().split('T')[1].split('.')[0]
            })
        });
        assert(res.status === 400 || res.status === 409 || res.status === 422, `Consecutive CHECK_IN handled (got ${res.status} ${JSON.stringify(await res.json())})`);

        log('--- Fetch & Search ---');
        res = await fetch(`${API_BASE}/attendance/${attId}`, { headers });
        let currData = await res.json();
        assert(res.status === 200, 'Get Attendance by ID status 200');
        assert(currData?.data?.attendanceCode === attCode, 'Get Attendance returns correct data');

        res = await fetch(`${API_BASE}/attendance?search=${attCode}`, { headers });
        const listData = await res.json();
        assert(listData?.data?.attendance?.length > 0, 'Search returned results');

        log('--- Partial Update (Admin) ---');
        res = await fetch(`${API_BASE}/attendance/${attId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ remarks: 'Updated remarks' })
        });
        assert(res.status === 200, `Update status 200 (got ${res.status})`);
        let ud = await res.json();
        assert(ud?.data?.remarks === 'Updated remarks', 'Partial update saved correctly');
        assert(ud?.data?.status === 'PRESENT', 'Partial update preserves existing values');

        log('--- Corrections & History ---');
        res = await fetch(`${API_BASE}/attendance/${attId}/correct`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                status: 'MANUAL',
                remarks: 'Forgot to swipe out properly',
                correctionReason: 'Manual override by HR'
            })
        });
        assert(res.status === 200, `Correct status 200 (got ${res.status} ${JSON.stringify(await res.json())})`);

        res = await fetch(`${API_BASE}/attendance/${attId}`, { headers });
        currData = await res.json();
        assert(currData?.data?.status === 'MANUAL', 'Status updated by correction');
        assert(currData?.data?.correctionHistory?.length === 1, 'Correction history appended');

        res = await fetch(`${API_BASE}/attendance/${attId}/history`, { headers });
        const histData = await res.json();
        assert(histData?.data?.correctionHistory?.length === 1, 'History endpoint returns data');
        assert(histData?.data?.correctionHistory?.[0]?.correctionReason === 'Manual override by HR', 'History reason matched');

        log('--- Teardown ---');
        await fetch(`${API_BASE}/attendance/${attId}`, { method: 'DELETE', headers });
        await fetch(`${API_BASE}/faculty/${facultyId}`, { method: 'DELETE', headers });
        await fetch(`${API_BASE}/devices/${deviceId}`, { method: 'DELETE', headers });

        log(`\nAttendance QA Complete: ${passed} passed, ${failed} failed`);
        if (failed > 0) log('Failures:\n' + failures.join('\n'));

    } catch (e) {
        console.error('QA Script Error:', e);
    }
}

runQA();
