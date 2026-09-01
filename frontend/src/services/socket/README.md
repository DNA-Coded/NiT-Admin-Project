# Future Socket.IO Real-time Integration

This directory is designated for real-time integrations, primarily monitoring live attendance logs from biometric devices and tracking online device statuses.

## Structure Outline

Once Socket.io integration begins:
- Create `client.ts` to initialize the socket manager pointing to the server WS endpoint.
- Export connection wrappers, event registration hooks, and message dispatchers.
- Use context providers to manage socket connectivity states globally.
