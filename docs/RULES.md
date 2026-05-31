# Enterprise Next.js Project Structure
 
## Overview
 
This rule defines the canonical file and folder structure for an enterprise-grade Next.js codebase using the App Router, TypeScript, Tailwind CSS, Zustand, and Prisma.
 
---
 
## Directory Structure
 
```
my-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── layout.tsx
│   └── error.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   └── UserForm.tsx
│   ├── layouts/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── providers/
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
├── store/
│   ├── useUserStore.ts
│   └── useUIStore.ts
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
├── types/
│   ├── api.ts
│   ├── models.ts
│   └── next-auth.d.ts
├── config/
│   ├── constants.ts
│   ├── routes.ts
│   └── site.ts
├── __tests__/
│   ├── unit/
│   │   └── utils.test.ts
│   ├── integration/
│   │   └── api.test.ts
│   └── e2e/
│       └── auth.spec.ts
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
 
---
 
## Rules
 
### `app/` — App Router
 
- Use **route groups** (parentheses syntax) to scope layouts and middleware without affecting the URL. Example: `(auth)` and `(dashboard)` are separate groups with separate layouts.
- Every route group with shared UI must have its own `layout.tsx`.
- Place a root `error.tsx` at `app/error.tsx` as a global error boundary.
- API route handlers live under `app/api/` and are named `route.ts`. One file per HTTP concern.
- Never colocate page logic (data fetching, mutations) directly inside `page.tsx`; delegate to server actions or API routes.
### `components/` — UI Components
 
- Split into three sublayers: `ui/`, `forms/`, `layouts/`, and `providers/`.
- `ui/` holds **dumb, reusable atoms** (Button, Input, Modal). These components receive all data via props and own no state.
- `ui/index.ts` must re-export all atoms as a barrel export.
- `forms/` holds **smart form components** wired to React Hook Form and Zod. No raw `<form>` elements elsewhere.
- `layouts/` holds structural chrome: Sidebar, Topbar, page wrappers. These render once per route, not per data item.
- `providers/` holds React context wrappers. Never nest context logic inside `layout.tsx` directly.
- Components are PascalCase. Files match component name exactly.
### `hooks/` — Custom React Hooks
 
- All custom hooks live here; none are colocated inside component files unless they are single-use and trivial.
- Hook files are camelCase and prefixed with `use`.
- Hooks must not import from `store/` directly — they may call store selectors, but business logic stays in the hook.
### `store/` — State Management (Zustand)
 
- One file per domain slice. Never a single monolithic store file.
- `useUIStore.ts` manages ephemeral UI state only: toasts, modal visibility, loading flags.
- `useUserStore.ts` manages persisted session/user state.
- Slice files are camelCase and prefixed with `use`.
- No direct DOM access or side effects inside store slices — use hooks for that.
### `lib/` — Shared Utilities
 
- `lib/api/client.ts` exports a single configured Axios (or `fetch`) instance. All HTTP calls go through this.
- `lib/api/endpoints.ts` exports typed route string constants. Never hardcode API paths elsewhere.
- `lib/auth.ts` holds the NextAuth configuration object. Not imported by client components.
- `lib/db.ts` exports the Prisma client singleton. Not imported by client components.
- `lib/utils.ts` holds pure utility functions: `cn()` (class merging), date formatters, etc.
### `types/` — TypeScript Types
 
- `api.ts` — request/response shapes for all API routes.
- `models.ts` — domain model interfaces (User, Post, etc.) that mirror the database schema.
- `next-auth.d.ts` — module augmentation to extend the `Session` and `JWT` types.
- No inline `interface` or `type` declarations inside component files for shared types — they go here.
### `config/` — App Configuration
 
- `constants.ts` — environment-agnostic constants (pagination limits, feature flags, etc.).
- `routes.ts` — a typed route map. Use this instead of string-interpolating paths anywhere in the codebase.
- `site.ts` — site metadata: name, description, OG defaults, used by Next.js `metadata` exports.
### `__tests__/` — Tests
 
- Tests are split by type: `unit/`, `integration/`, `e2e/`.
- `unit/` — pure function tests with Vitest or Jest. No network, no DB.
- `integration/` — API route tests using `@testing-library` or a test client. May hit a test DB.
- `e2e/` — Playwright specs. Full browser flows against a running dev server.
- Test files mirror the path of the file they test. Example: `lib/utils.ts` → `__tests__/unit/utils.test.ts`.
---
 
## Naming Conventions
 
| Artifact          | Convention        | Example                  |
|-------------------|-------------------|--------------------------|
| Pages / Layouts   | lowercase kebab   | `app/(dashboard)/page.tsx` |
| Components        | PascalCase        | `Button.tsx`, `UserForm.tsx` |
| Hooks             | camelCase + `use` | `useAuth.ts`             |
| Store slices      | camelCase + `use` | `useUserStore.ts`        |
| Utilities / Lib   | camelCase         | `utils.ts`, `client.ts`  |
| Types             | camelCase         | `models.ts`, `api.ts`    |
| Config files      | camelCase         | `routes.ts`, `site.ts`   |
| Test files        | source name + `.test` or `.spec` | `utils.test.ts` |
 
---
 
## Import Order
 
Enforce this order via ESLint `import/order`:
 
1. Node built-ins (`fs`, `path`)
2. External packages (`react`, `next`, `zod`)
3. Internal aliases (`@/components`, `@/lib`)
4. Relative imports (`./Button`, `../utils`)
5. Type-only imports (`import type { ... }`)
---
 
## Path Aliases (`tsconfig.json`)
 
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/store/*": ["./store/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"]
    }
  }
}
```
 
Never use deep relative imports (`../../../lib/utils`). All cross-directory imports must use aliases.
 
---
 
## What Goes Where — Quick Reference
 
| Question                            | Answer                                  |
|-------------------------------------|-----------------------------------------|
| New page or route?                  | `app/(group)/route-name/page.tsx`       |
| New API endpoint?                   | `app/api/resource/route.ts`             |
| New reusable UI atom?               | `components/ui/ComponentName.tsx`       |
| New form with validation?           | `components/forms/ResourceForm.tsx`     |
| New data-fetching logic?            | `hooks/useResourceName.ts`              |
| New global state?                   | `store/useResourceStore.ts`             |
| New shared type?                    | `types/models.ts` or `types/api.ts`     |
| New environment-agnostic constant?  | `config/constants.ts`                   |
| New route path?                     | `config/routes.ts`                      |
| New utility function?               | `lib/utils.ts`