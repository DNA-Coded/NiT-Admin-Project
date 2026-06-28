# NiT Admin Frontend Project Guidelines & Architecture

## Single Source of Truth
This document (GEMINI.md) is the single source of truth for the NiT Admin project. Before making architectural decisions or writing code, always consult and follow the guidelines in this file.

## 1. Project Overview
- **Name:** NiT Admin
- **Purpose:** Internal biometric-based staff attendance management system for Narula Institute of Technology.
- **Target Audience:** HR staff, administrative staff, and management ONLY. (Employees do not log in, they only use biometric devices).
- **Current Phase Scope:** Frontend ONLY. No backend implementation yet. However, architect the frontend to easily integrate with future backend APIs and Socket.io for live updates.

## 2. Technology Stack
- **Framework:** React
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui

## 3. Design Principles
- **Aesthetic:** Professional enterprise HR software (e.g., SAP SuccessFactors, Oracle HRMS, Workday, Zoho People).
- **Anti-patterns:** MUST NOT resemble an AI dashboard, startup landing page, analytics demo, crypto dashboard, or student project.
- **Responsiveness:** Mobile-first, but optimized for desktop since administrators will primarily use desktop/laptops.

## 4. Color Palette & Design Tokens
Derived from the Material Design 3 inspired Stitch export.
- **Primary:** `#263b74`
- **Primary Container:** `#3f538d`
- **On-Primary:** `#ffffff`
- **Background / Surface:** `#f9f9ff`
- **Surface Container Lowest:** `#ffffff` (Card backgrounds)
- **Status Colors:**
  - Success (Present/IN): Green (`#16a34a`)
  - Danger (Absent/OUT): Red (`#dc2626`)
  - Warning (Late): Amber (`#d97706`)

## 5. Folder Structure & Architecture
We use a **Feature-Driven Design** pattern to ensure scalability.

```
src/
├── app/                  # Application layer: Global setup, providers, main router setup
├── assets/               # Static assets: images, fonts, global icons
├── components/           # Shared, domain-agnostic UI components
│   ├── ui/               # shadcn/ui components (Button, Input, Table, etc.)
│   └── shared/           # Custom shared components (e.g., KPI Card, Status Badge)
├── config/               # Global configurations
├── constants/            # Global constants (e.g., ROUTES, ROLES)
├── features/             # Feature-based modules (Core business logic)
│   ├── dashboard/        # Dashboard specific code
│   ├── employees/        # Employee directory, management
│   └── ...               # (attendance, departments, payroll, devices)
├── hooks/                # Global custom hooks
├── layouts/              # Reusable page layouts (e.g., AdminLayout)
├── mocks/                # Mock data and services for the current no-backend phase
├── pages/                # Route components (Thin wrappers composing features)
├── services/             # Global services (API client setup, Socket.io client)
├── styles/               # Global CSS (Tailwind directives)
├── types/                # Global TypeScript declarations
└── utils/                # Global utility functions (e.g., formatDate, cn)
```

## 6. Coding Standards
- **Strict TypeScript:** Avoid `any`. Define strong interfaces/types in `types/` folders (either globally or feature-specific).
- **Component Encapsulation:** Feature-specific components belong in `src/features/<feature_name>/components`, NOT global `src/components`.
- **Mocking Strategy:** Since there's no real API yet, create clear mock layers in `src/mocks` and keep API calls encapsulated in `src/features/<feature_name>/services/api.ts` so they can easily be swapped later. Use mocked data stored centrally.
- **Styling:** Use Tailwind CSS utility classes. Use `cn()` utility for merging tailwind classes, especially in custom UI components.
- **Functional Components:** Use functional React components only.
- **Reusability & DRY:** Use reusable components. Avoid duplicated code. Never hardcode data inside components.
- **Priorities:** Prioritize readability, maintainability, scalability, and accessibility over clever implementations.
- **Uncertainty:** If unsure about a design decision, ask instead of assuming.

## 7. Strict Engineering & Scope Rules
- **Frontend ONLY:** Never implement backend. Prepare interfaces for future backend integration.
- **No API Invention:** Never invent APIs.
- **No Business Logic:** Never calculate attendance, never calculate payroll, and never implement business logic on the frontend.
- **No Authentication:** Never implement authentication logic.
- **Mandatory UI States:** EVERY page/component must handle and display the following states:
  - Loading state
  - Empty state
  - Error state placeholder
  - Future API integration placeholder
