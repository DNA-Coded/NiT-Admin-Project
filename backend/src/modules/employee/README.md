# Module: Employee

## Purpose
Manages the employee and staff directory for Narula Institute of Technology. Provides endpoints for listing, viewing, and managing staff records. Staff do **not** log into the system — they are only subjects of biometric attendance tracking.

## Planned Files

| File | Description |
|---|---|
| `employee.controller.js` | CRUD handlers for employee records |
| `employee.routes.js` | Registers all `/api/v1/employee/*` routes |
| `employee.validator.js` | Validates create/update request bodies |
| `employee.service.js` | Business logic — filtering, pagination, department linking |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/employee` | Protected | List employee with filters (dept, status, search) |
| `GET` | `/api/v1/employee/:id` | Protected | Get single employee member detail |
| `POST` | `/api/v1/employee` | HR Admin+ | Create new employee record |
| `PUT` | `/api/v1/employee/:id` | HR Admin+ | Update employee record |

## Data Shape (from `src/types/employees.ts`)
Refer to the frontend TypeScript interface `Employee` for the expected JSON structure that this module must return.

## Status
🔲 Not implemented — pending auth phase and `Employee` Mongoose model.
