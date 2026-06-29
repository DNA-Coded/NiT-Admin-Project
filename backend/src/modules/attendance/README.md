# Module: Attendance

## Purpose
Processes and exposes biometric punch records captured by the device network. This module is the core data source for the Live Attendance Monitor and all reporting features.

## Planned Files

| File | Description |
|---|---|
| `attendance.controller.js` | Handlers for listing records and getting detail |
| `attendance.routes.js` | Registers all `/api/v1/attendance/*` routes |
| `attendance.validator.js` | Validates query filters (date, dept, status, employeeId) |
| `attendance.service.js` | Aggregation logic — daily summaries, on-campus count |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/attendance` | Protected | List records with filters + pagination |
| `GET` | `/api/v1/attendance/:id` | Protected | Get single attendance record detail |

## Key Constants
- `ATTENDANCE_STATUS` from `src/constants/attendance.constants.js`
- `PUNCH_TYPE` from `src/constants/attendance.constants.js`

## WebSocket Integration
This module will emit real-time events via Socket.IO:
- `attendance:new-event` — triggered on each new biometric punch
- `attendance:summary-update` — live KPI counter update

## Status
🔲 Not implemented — pending auth phase and `AttendanceRecord` Mongoose model.
