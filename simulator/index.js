import axios from 'axios';

// ── Configuration ──────────────────────────────────────────────────────────────
const API_URL = process.env.API_URL || 'http://localhost:5000/api/v1';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTg4MWQ5MjU3OTk1MDYyYjZlNTYxMSIsImVtYWlsIjoic2VjdXJlYWRtaW5Abml0LmFjLmluIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzg0NjU3MTU0LCJleHAiOjE3ODQ2NTgwNTR9.AaRbPm4kMkr6jVUTwNb-u-rl3dM4UA6plQ_IRtIoXGU';

// Standard verification methods from your schema
const VERIFICATION_METHODS = ['FINGERPRINT', 'FACE_RECOGNITION', 'RFID', 'PIN'];

// Sample Employee/Student IDs to simulate scans
const MOCK_USERS = ['EMP-1001', 'EMP-1002', 'EMP-1003', 'STU-2026-01', 'STU-2026-02'];

// Configured devices (or leave array empty to auto-fetch from backend)
let targetDevices = [
  // Example device matching your schema
  {
    id: '6a5fa770ed74ede129069eb1', // Replace with a real MongoDB ObjectId from your DB
    deviceCode: 'DEV-MAIN-01',
    heartbeatIntervalMs: 15000, // Every 15s
    scanIntervalMs: 10000,      // Scan every 10s
  },
];

// ── API Helpers ────────────────────────────────────────────────────────────────

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

/**
 * Sends a heartbeat ping matching your schema fields:
 * updates status, healthStatus, lastHeartbeat, and lastSeen.
 */
async function sendHeartbeat(device) {
  try {
    const payload = {
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      lastHeartbeat: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      uptime: Math.floor(process.uptime()), // Uptime in seconds
    };

    await axios.post(`${API_URL}/devices/${device.id}/heartbeat`, payload, { headers });
    console.log(`💚 [HEARTBEAT OK] ${device.deviceCode} (${device.id}) -> ONLINE`);
  } catch (error) {
    console.error(
      `❌ [HEARTBEAT FAIL] ${device.deviceCode} - ${error.response?.data?.message || error.message}`
    );
  }
}

/**
 * Simulates a physical user scan event (Fingerprint/Face/Card)
 */
async function sendScanEvent(device) {
  try {
    const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    const randomMethod = VERIFICATION_METHODS[Math.floor(Math.random() * VERIFICATION_METHODS.length)];

    const payload = {
      deviceCode: device.deviceCode,
      userCode: randomUser,
      verificationMethod: randomMethod,
      timestamp: new Date().toISOString(),
    };

    await axios.post(`${API_URL}/devices/${device.id}/events`, payload, { headers });
    console.log(`⚡ [SCAN EVENT] ${device.deviceCode} -> User: ${randomUser} via ${randomMethod}`);
  } catch (error) {
    console.error(
      `❌ [SCAN FAIL] ${device.deviceCode} - ${error.response?.data?.message || error.message}`
    );
  }
}

/**
 * Optional: Automatically fetches all registered devices from your backend
 */
async function fetchDevicesFromBackend() {
  try {
    console.log('📡 Fetching registered devices from backend...');
    const response = await axios.get(`${API_URL}/devices`, { headers });
    const devices = response.data?.data || response.data;

    if (Array.isArray(devices) && devices.length > 0) {
      targetDevices = devices.map((d) => ({
        id: d.id || d._id,
        deviceCode: d.deviceCode,
        heartbeatIntervalMs: (d.heartbeatInterval || 1) * 60000, // convert minutes to ms (or default 1m)
        scanIntervalMs: 12000, // Scan every 12 seconds
      }));
      console.log(`✅ Loaded ${targetDevices.length} device(s) from database.`);
    }
  } catch (error) {
    console.warn(`⚠️ Could not auto-fetch devices: ${error.message}. Using fallback targetDevices array.`);
  }
}

// ── Main Execution ─────────────────────────────────────────────────────────────

async function startSimulator() {
  console.log('🚀 Starting Biometric Device Hardware Simulator...');

  // 1. Try to fetch real devices from your DB API
  await fetchDevicesFromBackend();

  if (targetDevices.length === 0) {
    console.error('❌ No devices found to simulate. Add a device via your API/Form first.');
    process.exit(1);
  }

  // 2. Start simulation loops for each device
  targetDevices.forEach((device) => {
    console.log(`🤖 Initializing Mock Terminal: ${device.deviceCode}`);

    // Send initial immediate ping
    sendHeartbeat(device);

    // Continuous Heartbeat Loop
    setInterval(() => sendHeartbeat(device), device.heartbeatIntervalMs);

    // Continuous Random Attendance Scan Loop
    setInterval(() => sendScanEvent(device), device.scanIntervalMs);
  });
}

startSimulator();