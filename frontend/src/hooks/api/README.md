# Future React Query Integration Hooks

This directory will hold all custom query hooks to separate UI component structures from backend fetch operations.

## Structure Outline

Once backend integration begins:
- Wrap Axios endpoints from `src/services/api/` inside React Query `useQuery` and `useMutation` hooks.
- Example structure: `src/hooks/api/useEmployees.ts` will fetch the employee lists, automatically handle caching, caching invalidation on updates, and provide strict loading/error states directly to our components.
