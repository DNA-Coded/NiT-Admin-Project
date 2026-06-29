# Module: Faculty

## Purpose
Manages the faculty and staff directory for Narula Institute of Technology. Provides endpoints for listing, viewing, and managing staff records. Staff do **not** log into the system — they are only subjects of biometric attendance tracking.

## Planned Files

| File | Description |
|---|---|
| `faculty.controller.js` | CRUD handlers for faculty records |
| `faculty.routes.js` | Registers all `/api/v1/faculty/*` routes |
| `faculty.validator.js` | Validates create/update request bodies |
| `faculty.service.js` | Business logic — filtering, pagination, department linking |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/faculty` | Protected | List faculty with filters (dept, status, search) |
| `GET` | `/api/v1/faculty/:id` | Protected | Get single faculty member detail |
| `POST` | `/api/v1/faculty` | HR Admin+ | Create new faculty record |
| `PUT` | `/api/v1/faculty/:id` | HR Admin+ | Update faculty record |

## Data Shape (from `src/types/employees.ts`)
Refer to the frontend TypeScript interface `Employee` for the expected JSON structure that this module must return.

## Status
🔲 Not implemented — pending auth phase and `Faculty` Mongoose model.
