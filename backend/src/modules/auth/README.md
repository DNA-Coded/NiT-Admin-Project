# Module: Auth

## Purpose
Handles all administrator authentication flows for the NiT Admin system. Provides JWT-based identity verification and role-based access control (RBAC) that protects all other API modules.

## Files

| File | Status | Description |
|---|---|---|
| `auth.model.js` | ✅ | `Admin` Mongoose schema — fullName, email, hashed password, role, department, isActive, lastLogin |
| `auth.service.js` | ✅ | `generateAccessToken()`, `verifyAccessToken()` — JWT utilities |
| `auth.middleware.js` | ✅ | `authenticate` — JWT→req.admin pipeline; `authorize(...roles)` — RBAC guard |
| `auth.controller.js` | 🔲 Placeholder | login, logout, getMe handlers — return placeholder responses until login phase |
| `auth.routes.js` | ✅ | Routes registered; middleware imports pre-written but commented until login phase |
| `auth.validator.js` | 🔲 Placeholder | Validation pattern documented; to be implemented with express-validator |
| `README.md` | ✅ | This file |

## API Endpoints

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | 🔲 Placeholder | Authenticate admin, return JWT |
| `POST` | `/api/v1/auth/logout` | Protected | 🔲 Placeholder | Invalidate session |
| `GET` | `/api/v1/auth/me` | Protected | 🔲 Placeholder | Get current admin profile |

## Admin Model Schema

```js
{
  fullName:   String,   required, 2–100 chars
  email:      String,   required, unique, indexed
  password:   String,   required, ≥8 chars, select: false (never returned)
  role:       String,   enum: super_admin | admin | hod | faculty
  department: String,   optional (required for hod/faculty)
  isActive:   Boolean,  default: true
  lastLogin:  Date,     default: null
  createdAt:  Date,     auto (timestamps)
  updatedAt:  Date,     auto (timestamps)
}
```

## Roles

| Constant | Value | Access Level |
|---|---|---|
| `ROLES.SUPER_ADMIN` | `super_admin` | Full system access |
| `ROLES.ADMIN` | `admin` | HR admin — employees, attendance, payroll |
| `ROLES.HOD` | `hod` | Department-scoped read + attendance |
| `ROLES.FACULTY` | `faculty` | Read-only attendance |

## Middleware Usage

```js
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { ROLES } from '../../constants/index.js';

// Require any logged-in admin
router.get('/profile', authenticate, getProfile);

// Require specific roles
router.post('/users', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), createUser);
```

## Planned Response Shapes

**Login success (`200`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "<jwt>",
    "admin": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      "role": "admin",
      "department": null,
      "isActive": true,
      "lastLogin": "2026-06-29T08:00:00.000Z"
    }
  }
}
```

**Unauthorized (`401`):**
```json
{ "success": false, "message": "No token provided. Please log in.", "data": null }
```

**Forbidden (`403`):**
```json
{ "success": false, "message": "You do not have permission to perform this action.", "data": null }
```

## Implementation Checklist (Login Phase)
- `[ ]` Implement `loginAdmin()` in `auth.service.js`
- `[ ]` Wire `validateLogin` validator in `auth.routes.js`
- `[ ]` Wire `authenticate` middleware on `/logout` and `/me`
- `[ ]` Implement controller handlers using `auth.service.js`
- `[ ]` Update `lastLogin` timestamp on successful login
