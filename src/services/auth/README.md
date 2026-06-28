# Future Authentication & Permission Integration

This directory is designated for administering authentication state, storing auth tokens (JWT), and managing user access policies.

## Structure Outline

Once authentication integration begins:
- Create `authService.ts` to coordinate login flows, token refreshes, and logout.
- Export authorization checks (e.g. `hasRole(['SUPER_ADMIN', 'HR_ADMIN'])`) to protect specific modules and admin operations (such as managing devices or approving payroll).
- Set up an `AuthProvider` state machine that handles routing redirection based on auth credentials.
