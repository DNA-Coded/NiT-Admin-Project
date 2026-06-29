# NiT Admin — Backend

> Internal biometric-based staff attendance management system for **Narula Institute of Technology**.  
> Backend API built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Architecture Notes](#architecture-notes)

---

## Project Overview

This is the backend service for the NiT Admin system. It provides a REST API consumed by the React + TypeScript frontend. The system manages biometric device punch data, staff attendance records, department organization, and payroll integration.

**Target Audience:** HR Staff, Administrative Staff, and Management.  
**Current Phase:** Foundation architecture — no authentication, no business logic, no database schemas yet.

---

## Folder Structure

```
backend/
├── .env                          # Local environment variables (not committed)
├── .env.example                  # Template for environment setup
├── .gitignore
├── package.json
└── src/
    ├── app.js                    # Express app — middleware & route mounting
    ├── server.js                 # Entry point — boots DB + HTTP server
    │
    ├── config/                   # Shared configuration modules
    │   ├── db.js                 # Mongoose connection
    │   ├── server.config.js      # PORT, NODE_ENV, API_VERSION
    │   ├── cors.config.js        # CORS allowed-origins from env
    │   └── logger.config.js      # Winston logger (console + file transports)
    │
    ├── constants/                # Shared application constants
    │   ├── roles.constants.js    # ROLES — admin, hr, dept_head, viewer
    │   ├── permissions.constants.js  # PERMISSIONS + ROLE_PERMISSIONS map
    │   ├── attendance.constants.js   # ATTENDANCE_STATUS, PUNCH_TYPE, LEAVE_TYPE
    │   ├── messages.constants.js     # MESSAGES — standardized API strings
    │   └── index.js              # Barrel export
    │
    ├── helpers/                  # Shared reusable utility functions
    │   ├── response.helper.js    # sendSuccess() / sendError()
    │   └── index.js              # Barrel export
    │
    ├── middleware/               # Shared Express middleware
    │   └── error.middleware.js   # 404 handler + centralized error formatter
    │
    ├── modules/                  # Feature modules (one folder per domain)
    │   ├── health/               # ✅ Implemented
    │   │   ├── health.controller.js
    │   │   ├── health.routes.js
    │   │   ├── health.validator.js
    │   │   └── README.md
    │   ├── auth/                 # 🔲 Placeholder — pending auth phase
    │   │   └── README.md
    │   ├── faculty/              # 🔲 Placeholder
    │   │   └── README.md
    │   ├── students/             # 🔲 Placeholder
    │   │   └── README.md
    │   ├── attendance/           # 🔲 Placeholder
    │   │   └── README.md
    │   ├── departments/          # 🔲 Placeholder
    │   │   └── README.md
    │   └── devices/              # 🔲 Placeholder
    │       └── README.md
    │
    ├── models/                   # Mongoose schemas (not yet implemented)
    │
    ├── routes/                   # Versioned route aggregator
    │   └── index.js              # Mounts all module routers under /api/v1
    │
    ├── services/                 # Cross-module shared services (future)
    │
    ├── sockets/                  # Socket.IO real-time layer
    │   └── socket.js             # initSocket() placeholder — not wired yet
    │
    ├── uploads/                  # File upload storage (future)
    │
    ├── utils/                    # Low-level shared utilities
    │   └── asyncHandler.js       # Async controller wrapper
    │
    ├── validators/               # Shared validation utilities (placeholder)
    │   └── index.js
    │
    └── logs/                     # Auto-generated log files
        ├── combined.log          # All log levels
        └── error.log             # Errors only
```

---

## Installation

**Prerequisites:** Node.js ≥ 18, MongoDB ≥ 6 (local or Atlas URI)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MONGODB_URI and any other values

# 4. Start the development server
npm run dev
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start with nodemon (hot-reload) |
| `start` | `npm start` | Start in production mode |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP server port |
| `MONGODB_URI` | `mongodb://localhost:27017/nit-admin` | MongoDB connection string |
| `NODE_ENV` | `development` | Runtime environment (`development` \| `production` \| `test`) |
| `API_VERSION` | `v1` | API version prefix used in all route paths |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated list of allowed CORS origins |

---

## API Endpoints

All endpoints are prefixed with `/api/${API_VERSION}` (default: `/api/v1`).

### Health

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/health` | System health check | Public |

**Success Response** (`200 OK`):
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

**Error Response Format** (all errors):
```json
{
  "success": false,
  "message": "Not Found - /api/v1/unknown",
  "data": null
}
```

---

## Architecture Notes

### Response Envelope
Every API response — success or error — follows this standard shape:
```json
{ "success": boolean, "message": string, "data": any | null }
```
Use `sendSuccess()` and `sendError()` from `src/helpers/response.helper.js` in all controllers.

### Async Controllers
Wrap all async controller functions with `asyncHandler` from `src/utils/asyncHandler.js`. This eliminates boilerplate `try/catch` blocks and ensures all promise rejections are forwarded to the centralized error middleware.

### Logging
- **Winston** handles all application logs (startup, DB connection, errors).
- **Morgan** handles HTTP request logs — piped through Winston's stream.
- Log files are written to `src/logs/` and are ignored by git.

### API Versioning
All routes are registered through `src/routes/index.js` and mounted under `/api/v1` in `app.js`. Adding a new version means mounting a new `routes/v2/index.js` alongside the existing one.

### Socket.IO
The `src/sockets/socket.js` file exports `initSocket(httpServer)` and `getIO()`. It is **not wired to the server yet**. Call `initSocket(server)` in `server.js` when the real-time layer is ready to be activated.

### Future Phases
- **Authentication**: JWT-based auth with refresh tokens (see `BACKEND_INTEGRATION.md`)
- **Database Schemas**: Mongoose models in `src/models/`
- **Feature APIs**: Employee, Attendance, Departments, Devices, Payroll, Reports, Settings
- **Socket.IO Events**: Live attendance feed, device status updates
- **Validation**: `express-validator` or `zod` in `src/validators/`
