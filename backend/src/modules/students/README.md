# Module: Students

## Purpose
Manages the student directory for Narula Institute of Technology. Students, like faculty, do **not** log into the admin system — they are tracked via biometric devices. This module exposes student records for administrative management.

## Planned Files

| File | Description |
|---|---|
| `students.controller.js` | CRUD handlers for student records |
| `students.routes.js` | Registers all `/api/v1/students/*` routes |
| `students.validator.js` | Validates student create/update payloads |
| `students.service.js` | Business logic — enrollment, department grouping |

## Planned API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/students` | Protected | List students with filters |
| `GET` | `/api/v1/students/:id` | Protected | Get student detail |
| `POST` | `/api/v1/students` | HR Admin+ | Create student record |
| `PUT` | `/api/v1/students/:id` | HR Admin+ | Update student record |

## Status
🔲 Not implemented — pending auth phase and `Student` Mongoose model.
