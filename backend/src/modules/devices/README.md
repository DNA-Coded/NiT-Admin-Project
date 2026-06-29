# Module: Devices

## Purpose
Manages the biometric device network — tracks device inventory, connection health, and activity logs. Devices send punch data to the server; this module exposes that device metadata to administrators.

## Planned Files

| File | Description |
|---|---|
| `devices.controller.js` | Handlers for device listing, detail, ping, and activity logs |
| `devices.routes.js` | Registers all `/api/v1/devices/*` routes |
| `devices.validator.js` | Validates device filter queries and ping requests |
| `devices.service.js` | Business logic — device health scoring, ping handling |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/devices` | Protected | List all devices |
| `GET` | `/api/v1/devices/summary` | Protected | Device health summary |
| `GET` | `/api/v1/devices/:id` | Protected | Get device detail |
| `GET` | `/api/v1/devices/activities` | Protected | Device activity log |
| `POST` | `/api/v1/devices/:id/ping` | HR Admin+ | Trigger diagnostic ping |

## WebSocket Integration
This module will emit real-time device events:
- `device:status-change` — online/offline state change
- `device:alert` — device health alert

## Status
🔲 Not implemented — pending auth phase and `Device` Mongoose model.
