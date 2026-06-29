# Module: Health

## Purpose
Exposes the `/api/v1/health` endpoint which reports the live status of the server and its connected services. Used for uptime monitoring, load balancer health checks, and deployment verification.

## Files

| File | Description |
|---|---|
| `health.controller.js` | Returns server uptime, timestamp, and MongoDB connection state |
| `health.routes.js` | Registers `GET /` handled by the controller |
| `health.validator.js` | Validator placeholder — no validation needed for this endpoint |

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System health check |

## Response Shape

```json
{
  "success": true,
  "message": "Server is healthy.",
  "data": {
    "status": "UP",
    "timestamp": "2026-06-29T08:00:00.000Z",
    "uptime": "42s",
    "services": {
      "database": {
        "status": "UP",
        "state": "connected"
      }
    }
  }
}
```

## Future Additions
- Add checks for other services (Redis, S3, third-party APIs) as they are integrated.
- Add `verbose` query parameter to return extended diagnostics.
