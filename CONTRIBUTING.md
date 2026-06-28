# Contributing to NiT Admin

## Coding Standards

- **TypeScript**: Strict mode. Zero `any`. All props and return types must be explicitly typed.
- **Functional Components**: React functional components only. No class components.
- **Naming**: PascalCase for components, camelCase for variables/functions, UPPER_SNAKE_CASE for constants.
- **Imports**: Use `@/` path alias for all project imports. Prefer `type` imports for type-only imports.
- **Styling**: Tailwind CSS utility classes. Use `cn()` from `@/lib/utils` for conditional class merging.
- **State Management**: React hooks (useState, useEffect, useCallback, useMemo). No external state library yet.
- **No Business Logic**: Frontend displays only. All calculations come from future backend APIs.

## Folder Structure Conventions

| Directory | Purpose | Example |
|---|---|---|
| `src/types/` | Centralized TypeScript interfaces | `employees.ts`, `devices.ts` |
| `src/mocks/` | Centralized mock data | `employees.ts`, `devices.ts` |
| `src/constants/` | App-wide constants | Routes, departments, roles |
| `src/features/<name>/components/` | Feature-scoped components | `EmployeeCard.tsx` |
| `src/components/shared/` | Cross-feature reusable components | `StatePlaceholder.tsx` |
| `src/pages/` | Route page wrappers (thin) | `Employees.tsx` |

## Component Naming Conventions

- Feature components: `<FeatureName><Purpose>.tsx` (e.g., `PayrollSummaryCards.tsx`)
- Shared components: `<Purpose>.tsx` (e.g., `StatePlaceholder.tsx`)
- Page wrappers: `<PageName>.tsx` (e.g., `Dashboard.tsx`)

## Pull Request Guidelines

1. **One feature per PR** — Keep PRs focused and reviewable.
2. **Run `npm run build`** — Verify zero TypeScript errors before submitting.
3. **Run `npm run lint`** — Fix any linter issues.
4. **Update mock data** — If adding new UI elements, add corresponding mock data in `src/mocks/`.
5. **Update types** — If modifying data structures, update `src/types/` first.
6. **Test all states** — Verify loading, empty, error, and success states render correctly.

## Branch Naming

```
feature/<module-name>          # New feature module
fix/<issue-description>        # Bug fix
refactor/<scope>               # Code refactoring
docs/<topic>                   # Documentation changes
chore/<task>                   # Maintenance tasks
```

Examples:
- `feature/leave-management`
- `fix/payroll-filter-reset`
- `refactor/extract-shared-drawer`

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `test`

**Scope**: Module name (e.g., `dashboard`, `employees`, `devices`, `settings`)

Examples:
- `feat(payroll): add attendance exception panel`
- `fix(devices): correct offline count in summary cards`
- `refactor(shared): extract reusable drawer component`
- `docs(readme): add deployment instructions`
