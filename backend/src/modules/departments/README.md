# Module: Departments

## Purpose
Manages the department structure of Narula Institute of Technology. Provides department listings used across the employee directory, attendance filters, and payroll groupings.

## Planned Files

| File | Description |
|---|---|
| `departments.controller.js` | CRUD handlers for department records |
| `departments.routes.js` | Registers all `/api/v1/departments/*` routes |
| `departments.validator.js` | Validates department create/update payloads |
| `departments.service.js` | Business logic — headcount aggregation, HOD linking |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/departments` | Protected | List all departments with stats |
| `GET` | `/api/v1/departments/:id` | Protected | Get department detail |
| `POST` | `/api/v1/departments` | HR Admin+ | Create department |
| `PUT` | `/api/v1/departments/:id` | HR Admin+ | Update department |

## Status
🔲 Not implemented — pending auth phase and `Department` Mongoose model.
