# NiT Admin — Staff Attendance Management System

> Internal biometric-based staff attendance management platform for Narula Institute of Technology.

## Project Overview

NiT Admin is an enterprise-grade HR administration dashboard designed to manage biometric-based attendance tracking for institutional staff. The system is built for HR administrators, system administrators, and management personnel.

**Current Phase:** Frontend-only (v1.0.0-rc.1). Backend integration interfaces are prepared but not implemented.

## Features

| Module | Description |
|---|---|
| **Dashboard** | KPI overview, live attendance feed, department summaries, attendance charts |
| **Employees** | Employee directory, profile cards, advanced search and filtering |
| **Attendance Records** | Attendance logs with filters, calendar view, timeline, detail drawer |
| **Live Attendance Monitor** | Real-time biometric event feed with simulated live updates |
| **Reports & Analytics** | Trend charts, department comparisons, report generation UI |
| **Biometric Devices** | Device health monitoring, campus topology map, activity logs, alerts |
| **Payroll Summary** | Attendance-derived payroll review, exception tracking, audit drawer |
| **Settings** | 12-category administration console with tab navigation |

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 (strict) |
| Bundler | Vite 8 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router DOM 7 |
| UI Utilities | clsx, tailwind-merge, class-variance-authority |
| Icons | Google Material Symbols (Outlined) |
| Fonts | Inter, Plus Jakarta Sans |
| Linter | oxlint |

## Folder Structure

```
src/
├── app/                  # Router configuration
├── assets/               # Static assets (logo)
├── components/
│   ├── shared/           # Reusable cross-feature components
│   └── ui/               # shadcn/ui primitives
├── constants/            # Routes, departments, roles, navigation
├── design-system/        # Centralized design tokens
├── features/             # Feature-based modules
│   ├── attendance/
│   ├── dashboard/
│   ├── devices/
│   ├── employees/
│   ├── live-monitor/
│   ├── payroll/
│   ├── reports/
│   └── settings/
├── hooks/                # Custom hooks (prepared for API hooks)
├── layouts/              # AdminLayout (sidebar + topbar + outlet)
├── lib/                  # Utility functions (cn)
├── mocks/                # Centralized mock data (all modules)
├── pages/                # Route page components (thin wrappers)
├── services/             # Future API, auth, socket service stubs
└── types/                # Centralized TypeScript interfaces
```

## Architecture Overview

The project follows a **Feature-Driven Design** pattern:

- **Pages** are thin wrappers that compose feature components and pass mock data
- **Features** contain domain-specific components scoped to their module
- **Shared components** (`StatePlaceholder`, `StatusBadge`, `WidgetCard`) are reused across modules
- **Types** and **Mocks** are centralized for easy future API swapping
- **Routes** use lazy loading for code-splitting

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd NiT-Admin-Project

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | TypeScript type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run oxlint code analysis |

## Project Screenshots

> Screenshots will be added after visual QA is finalized.

## Future Backend Integration

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for the complete backend integration guide including expected REST endpoints, WebSocket events, DTOs, and replacement strategy.

## Deployment Notes

- The app is a static SPA — deploy to any static hosting (Vercel, Netlify, S3+CloudFront)
- Configure URL rewrites so all routes serve `index.html` (SPA fallback)
- Environment variables can be added via Vite's `import.meta.env` system
- Production build output is in the `dist/` directory

## Known Limitations

1. **No backend** — All data is mocked. No persistent storage.
2. **No authentication** — Access control is not implemented.
3. **No real-time** — Socket.IO interface is prepared but not connected.
4. **No payroll calculations** — Values are display-only from future APIs.
5. **No mobile sidebar** — Mobile hamburger menu button exists but drawer is not wired.
6. **CSS minifier warnings** — LightningCSS warns about Tailwind v4 at-rules from shadcn dependencies; these are harmless.

## Future Roadmap

1. Backend API integration (Node.js/Express + PostgreSQL)
2. Authentication & RBAC (JWT + role-based guards)
3. Real-time Socket.IO biometric event streaming
4. End-to-end testing (Playwright)
5. Unit testing (Vitest)
6. Dark mode support
7. Mobile-responsive sidebar drawer
8. Report PDF generation (server-side)
9. Internationalization (i18n)
10. Accessibility audit with axe-core

## License

Internal project — Narula Institute of Technology. Not for public distribution.
