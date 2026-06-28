# Backend Integration Guide

> This document defines the expected API contracts, WebSocket events, and integration strategy for connecting the NiT Admin frontend to its backend services.

## Expected REST Endpoints

### Authentication

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/login` | Authenticate user | `{ email, password }` | `{ token, user, role }` |
| POST | `/api/auth/logout` | Invalidate session | — | `{ success }` |
| GET | `/api/auth/me` | Get current user profile | — | `User` |
| POST | `/api/auth/refresh` | Refresh access token | `{ refreshToken }` | `{ token }` |

### Dashboard

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/dashboard/kpi` | KPI summary stats | `KPIStats` |
| GET | `/api/dashboard/live-feed` | Recent attendance events | `LiveAttendanceEvent[]` |
| GET | `/api/dashboard/department-summary` | Department attendance summary | `DepartmentSummary[]` |
| GET | `/api/dashboard/attendance-overview` | Attendance distribution | `AttendanceOverview` |
| GET | `/api/dashboard/on-campus` | Currently on-campus employees | `OnCampusEmployee[]` |

### Employees

| Method | Endpoint | Description | Query Params | Response |
|---|---|---|---|---|
| GET | `/api/employees` | List employees | `page, limit, dept, status, search` | `{ data: Employee[], total, page }` |
| GET | `/api/employees/:id` | Get employee detail | — | `Employee` |
| POST | `/api/employees` | Create employee | `Employee` body | `Employee` |
| PUT | `/api/employees/:id` | Update employee | `Employee` body | `Employee` |

### Attendance

| Method | Endpoint | Description | Query Params | Response |
|---|---|---|---|---|
| GET | `/api/attendance` | List attendance records | `date, dept, status, employeeId, page, limit` | `{ data: AttendanceRecord[], total }` |
| GET | `/api/attendance/:id` | Get attendance detail | — | `AttendanceRecord` |

### Reports

| Method | Endpoint | Description | Query Params | Response |
|---|---|---|---|---|
| GET | `/api/reports` | List generated reports | `page, limit, type` | `{ data: Report[], total }` |
| POST | `/api/reports/generate` | Generate a new report | `{ type, dateRange, department }` | `Report` |
| GET | `/api/reports/:id/download` | Download report file | — | Binary (PDF/Excel) |
| GET | `/api/reports/trends` | Attendance trend data | `dateRange` | `TrendDataPoint[]` |
| GET | `/api/reports/department-comparison` | Department comparison | `month` | `DeptComparisonData[]` |

### Devices

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/devices` | List all devices | `Device[]` |
| GET | `/api/devices/summary` | Device health summary | `DeviceSummary` |
| GET | `/api/devices/:id` | Get device detail | `Device` |
| GET | `/api/devices/activities` | Device activity logs | `DeviceActivity[]` |
| POST | `/api/devices/:id/ping` | Trigger diagnostic ping | `{ status, latency }` |

### Payroll

| Method | Endpoint | Description | Query Params | Response |
|---|---|---|---|---|
| GET | `/api/payroll/summary` | Payroll KPI summary | `month` | `PayrollSummary` |
| GET | `/api/payroll/records` | Payroll records list | `month, dept, status, page, limit` | `{ data: PayrollRecord[], total }` |
| GET | `/api/payroll/exceptions` | Attendance exceptions | `month` | `PayrollException[]` |
| POST | `/api/payroll/export` | Export payroll data | `{ month, format }` | Binary |

### Settings

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/settings/organization` | Get org settings | `OrgSettings` |
| PUT | `/api/settings/organization` | Update org settings | `OrgSettings` |
| GET | `/api/settings/attendance-rules` | Get attendance rules | `AttendanceRules` |
| PUT | `/api/settings/attendance-rules` | Update attendance rules | `AttendanceRules` |
| GET | `/api/settings/shifts` | List shift templates | `ShiftTemplate[]` |
| GET | `/api/settings/holidays` | List holidays | `Holiday[]` |
| GET | `/api/settings/roles` | List user roles | `UserRole[]` |
| GET | `/api/settings/audit-logs` | Get audit logs | `AuditLog[]` |

---

## Expected WebSocket Events

The Live Attendance Monitor is designed for Socket.IO integration.

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `subscribe:live-feed` | — | Subscribe to real-time attendance events |
| `unsubscribe:live-feed` | — | Unsubscribe from feed |
| `subscribe:device-status` | — | Subscribe to device health updates |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `attendance:new-event` | `LiveAttendanceEvent` | New biometric scan event |
| `device:status-change` | `{ deviceId, status, lastPing }` | Device online/offline change |
| `device:alert` | `{ deviceId, type, message }` | Device health alert |
| `attendance:summary-update` | `{ insideCampus, totalPresent }` | Live KPI counter update |

---

## Expected DTOs

All TypeScript interfaces are already defined in `src/types/`. The backend should return JSON matching these exact structures. Key files:

- `src/types/dashboard.ts` — KPIStats, LiveAttendanceEvent, DepartmentSummary
- `src/types/employees.ts` — Employee
- `src/types/attendance.ts` — AttendanceRecord
- `src/types/devices.ts` — Device, DeviceSummary, DeviceActivity
- `src/types/payroll.ts` — PayrollRecord, PayrollSummary, PayrollException
- `src/types/reports.ts` — Report, TrendDataPoint
- `src/types/settings.ts` — OrgSettings, AttendanceRules, ShiftTemplate, Holiday, UserRole, AuditLog

---

## Authentication Flow

1. User submits credentials via login form
2. Backend validates and returns JWT access token + refresh token
3. Frontend stores tokens (httpOnly cookie preferred, localStorage fallback)
4. All API requests include `Authorization: Bearer <token>` header
5. On 401 response, attempt token refresh via `/api/auth/refresh`
6. On refresh failure, redirect to login

**Frontend preparation:** The `src/services/auth/` directory is ready for the auth service implementation.

---

## Folder Integration Strategy

When backend is ready, the integration follows this pattern:

### 1. Create API service functions

```typescript
// src/features/employees/services/api.ts
import { apiClient } from '@/services/api/client';
import type { Employee } from '@/types/employees';

export async function fetchEmployees(params: EmployeeQueryParams): Promise<PaginatedResponse<Employee>> {
  return apiClient.get('/employees', { params });
}
```

### 2. Create React Query hooks

```typescript
// src/hooks/api/useEmployees.ts
import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '@/features/employees/services/api';

export function useEmployees(params: EmployeeQueryParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => fetchEmployees(params),
  });
}
```

### 3. Replace mock imports in page components

```diff
// src/pages/Employees.tsx
- import { mockEmployees } from '@/mocks/employees';
+ import { useEmployees } from '@/hooks/api/useEmployees';
```

---

## Mock Replacement Strategy

1. Install `@tanstack/react-query` and `axios`
2. Create `src/services/api/client.ts` with Axios instance and interceptors
3. For each module, create `src/features/<module>/services/api.ts`
4. Create corresponding hooks in `src/hooks/api/`
5. Replace `mockData` imports in pages with hook calls
6. The `ViewState` pattern (`loading`/`success`/`empty`/`error`) maps directly to React Query states

---

## Error Handling Strategy

```typescript
// Global API error handler
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Trigger token refresh or redirect to login
    }
    if (error.response?.status === 403) {
      // Show "insufficient permissions" toast
    }
    if (error.response?.status >= 500) {
      // Show generic server error notification
    }
    return Promise.reject(error);
  }
);
```

The `StatePlaceholder` component already handles `error` state with a retry button — this maps directly to React Query's `refetch()`.
