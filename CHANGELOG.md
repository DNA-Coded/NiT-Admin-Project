# Changelog

All notable changes to NiT Admin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0-rc.1] — 2026-06-28

### Architecture Foundation
- Initialized React + TypeScript + Vite project with Tailwind CSS and shadcn/ui
- Established feature-driven folder architecture
- Created centralized design system tokens (colors, spacing, typography, shadows)
- Created centralized constants (routes, departments, roles, navigation items)
- Set up path aliases (`@/`) and Vite configuration
- Created reusable `StatePlaceholder`, `StatusBadge`, `WidgetCard`, and `LiveIndicator` shared components
- Created `AdminLayout` with sidebar navigation and top navigation bar
- Prepared service stubs for future API, auth, and socket integration

### Dashboard
- Implemented KPI grid cards (Total Staff, Present Today, Absent Today, Inside Campus)
- Built live attendance feed with real-time-style event entries
- Created department summary table with attendance percentages
- Added attendance overview chart (CSS-based bar chart)
- Built on-campus widget showing currently present employees

### Employees
- Created employee directory with grid card layout
- Implemented advanced search and multi-filter system (department, designation, status, type)
- Built employee detail drawer with profile information
- Added responsive grid layout with loading/empty/error states

### Attendance Records
- Built attendance records table with comprehensive filtering
- Created attendance timeline component
- Implemented attendance calendar view
- Built attendance detail drawer with day-by-day breakdown
- Added export menu UI

### Live Attendance Monitor
- Created real-time attendance event feed with simulated live updates
- Built summary strip with live KPI counters
- Implemented campus presence list with employee status indicators
- Created device status grid showing biometric hardware states
- Added alerts panel for device warnings

### Reports & Analytics
- Built attendance trend chart (CSS-based multi-bar chart)
- Created department comparison chart
- Implemented quick report cards for common report types
- Built reports table with generated reports listing
- Created report detail drawer

### Biometric Device Management
- Created device summary cards (total, online, offline, sync success)
- Built device grid with individual device info cards
- Implemented campus device topology layout grouped by building
- Created device activity table with live heartbeat simulator
- Built device detail drawer with hardware specifications
- Added device alerts panel

### Payroll Summary
- Built payroll summary cards (6 KPI metrics)
- Created advanced payroll filter bar
- Implemented payroll review table with status badges
- Built payroll detail drawer with attendance matrix
- Created attendance exception panel for flagged issues

### Settings & System Administration
- Implemented 12-category tabbed settings navigation
- Built Organization, Attendance Rules, Working Hours panels
- Created Shift Management and Holiday Calendar tables
- Built Departments panel with search functionality
- Created User Roles panel with permission badges
- Implemented Notifications, Device Configuration, Security panels
- Built Audit Logs table with user activity trail
- Created System Information panel with API/DB status indicators

### Production Readiness
- Implemented route-level code splitting with React.lazy and Suspense
- Removed dead code (unused App.css, scaffold assets)
- Removed empty placeholder directories
- Fixed package.json project identity and version
- Added SEO meta description and noscript fallback
- Generated comprehensive README.md, CONTRIBUTING.md, CHANGELOG.md
- Generated BACKEND_INTEGRATION.md with API contract documentation
- Verified zero TypeScript errors, zero build failures
- Confirmed chunk size optimization (main bundle: 292kB gzipped: 93kB)
