// simulator.js
const { randomInt } = require('crypto');
const BASE_URL = 'http://localhost:5000/api/v1/events/ingest';
const PROVIDER = 'SIMULATOR';
const DEVICE_CODE = 'DEV-LIB-001';
const ENDPOINT = `${BASE_URL}?provider=${PROVIDER}&deviceCode=${DEVICE_CODE}`;

// Real numeric IDs corresponding to NIT/0017, NIT/0089, NIT/0170, NIT/0112 in your database
const mockEmployees = ['0017', '0089', '0197', '0402', '0112', '0170', '0244', '0791'];

// In-memory state tracker to toggle CHECK_IN vs CHECK_OUT per employee
const employeeStates = {};

function generateMockPayload() {
  const isSuccess = Math.random() > 0.1;
  const userId = mockEmployees[randomInt(mockEmployees.length)];

  // Determine punch type: alternate between CHECK_IN and CHECK_OUT
  const currentState = employeeStates[userId] || 'CHECK_OUT';
  const nextState = currentState === 'CHECK_IN' ? 'CHECK_OUT' : 'CHECK_IN';
  employeeStates[userId] = nextState;

  return {
    userId,
    timestamp: new Date().toISOString(),
    verifyMode: 'FINGERPRINT',
    attendanceType: nextState, // Toggles between CHECK_IN and CHECK_OUT
    status: isSuccess ? 'SUCCESS' : 'FAILED',
    confidence: isSuccess ? 98 : 30
  };
}

async function sendMockScan() {
  const payload = generateMockPayload();
  console.log(`\n[Simulator] Biometric scan detected for PIN/User: ${payload.userId} (${payload.attendanceType})...`);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[Success 201] Raw Event Stored: ${data.data.eventId}`);
    } else {
      console.error(`[Warning ${response.status}] Backend rejected payload:`, data);
    }
  } catch (error) {
    console.error(`[Error] Could not connect to backend at ${ENDPOINT}`);
  }
}

console.log("Starting NiT Biometric Hardware Simulator...");
console.log(`Targeting: ${ENDPOINT}`);
console.log("Press Ctrl+C to stop.\n");

setInterval(sendMockScan, 3000);