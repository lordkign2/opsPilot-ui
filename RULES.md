# OpsPilot UI Architectural Rules & Engineering Standards

**Scope:** `opspilot-ui` (Next.js / Tailwind CSS / shadcn/ui / Framer Motion / Zustand)  
**Status:** ENFORCED  

This document outlines the architectural patterns, styling standards, and engineering guidelines for the OpsPilot user interface. It ensures consistency, maintainability, performance, and compliance with our design system.

---

## 1. Core Architecture & Directory Layout

### 1.1 App Router & Routing Discipline
**[REQUIRED]** Use Next.js App Router conventions:
- Place page components inside route folders (`app/dashboard/page.tsx`, etc.).
- Group authenticated views using route groups if layout sharing is required (e.g., `app/(dashboard)/layout.tsx`).
- Keep page files (`page.tsx`) thin. They should import page-level containers or components rather than defining complex logic/markup.
- Use `layout.tsx` for shared structures (e.g., Top Navigation, Sidebar).

### 1.2 Component Categorization
**[REQUIRED]** Keep components categorized strictly under `components/`:
- `components/ui/`: Contains primitive, reusable UI components (e.g., shadcn/ui base elements).
- `components/dashboard/`, `components/customers/`, `components/orders/`, `components/payments/`, `components/ai/`: Domain-specific components.
- Do not define large domain-specific logic inside `components/ui/`.

---

## 2. Design System & Styling (Tailwind CSS)

### 2.1 Color Tokens & Variables
**[REQUIRED]** Use CSS custom variables mapped to Tailwind configuration. The primary theme uses a deep, calm, data-driven color scheme:
- **Background:** `--background: #0b1120`
- **Surface:** `--surface: #111827`
- **Primary:** `--primary: #00F5FF` (Neon cyan accent)
- **Secondary:** `--secondary: #7C3AED` (Calm deep purple accent)
- **Status:** `--success` (`#10B981`), `--warning` (`#F59E0B`), `--danger` (`#EF4444`)

**[PROHIBITED]** Do not hardcode arbitrary hex colors in component classes. Always use Tailwind design tokens or CSS variable classes.

### 2.2 Glassmorphism & Visual Aesthetics
**[REQUIRED]** Follow our premium "Intelligent Operations Center" aesthetic:
- Apply glassmorphism styling (`backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08);`) selectively for panels and cards to prevent readability and performance degradation.
- Use smooth borders (`rounded-[1rem]`, `rounded-[1.25rem]`, `rounded-[1.5rem]`).
- Design for responsive layouts, maintaining padding hierarchy (`p-4` to `p-8` based on screen size).

---

## 3. Motion System & Animations

### 3.1 Framer Motion Usage
**[REQUIRED]** Implement smooth transitions and micro-interactions:
- **Page Entry:** Every page must fade and slide up slightly on load:
  ```tsx
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
  ```
- **Cards:** Add subtle hover elevation or glow:
  ```tsx
  whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0, 245, 255, 0.05)" }}
  ```
- **Streaming Responses:** Use text-streaming effects for AI answers rather than standard abrupt loading.
- **Performance:** Keep animation durations snappy (usually `0.15s` to `0.3s`).

---

## 4. State Management & Data Fetching

### 4.1 UI State (Zustand)
**[REQUIRED]** Use Zustand stores (`stores/`) for global, client-only UI state (e.g., sidebar collapse, drawer opening states, user preferences).
- Keep store files atomic and well-typed.
- Implement selector functions when accessing store values to prevent unnecessary re-renders:
  ```typescript
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  ```

### 4.2 Server State (TanStack Query)
**[REQUIRED]** Use TanStack Query (React Query) for fetching, caching, synchronizing, and updating server data.
- **[PROHIBITED]** Do not use global Zustand stores to cache API responses.
- Wrap all queries in custom hooks under `hooks/` (e.g., `useCustomers.ts`, `usePayments.ts`).

---

## 5. Forms, Validation & Types

### 5.1 Form Handling (React Hook Form & Zod)
**[REQUIRED]** Use React Hook Form with Zod schemas for all user inputs and validation.
- Define schemas explicitly inside form components or under a dedicated `lib/validation/` or component subfolder.
- Provide clear error messages on inputs using validation criteria.

### 5.2 TypeScript Discipline
**[REQUIRED]** Ensure strict type safety:
- Avoid the use of `any`. If a type is unknown, use `unknown`.
- Declare domain interfaces and types under `types/` (e.g., `types/customer.ts`, `types/payment.ts`).
- Ensure all component props are fully typed.

---

## 6. Code Quality & Component Architecture

### 6.1 Component Reusability
**[REQUIRED]** Build and reuse the baseline components first:
- `MetricCard`, `StatCard`, `DataTable`, `SearchBar`, `PageHeader`, `ActivityFeed`, `AIInsightCard`, `EmptyState`, `LoadingState`, `ConfirmDialog`, `Drawer`, `Modal`.

### 6.2 SEO & Semantic HTML
**[REQUIRED]** Implement proper HTML5 semantic elements:
- Use `<header>`, `<nav>`, `<aside>`, `<main>`, `<footer>` appropriately.
- Ensure each page has a single `<h1>` representing the main title.
- Provide descriptive `title` and `meta` tags.
- Assign unique `id` attributes to all key interactive elements for reliable browser testing.

---

## 7. Development & Approval Workflow

### 7.1 Visual Layouts & Mockups
**[IMPORTANT]** Do not build or modify UI screens/routes until the explicit UI mockup/layout image has been provided by the user.
- **Starting with Auth screens:** Ask the user for the visual mockup/image first.
- Once the image is provided, proceed with building the page layout to match the provided mockup.
- For new pages or major additions, request visual mockups before executing the frontend implementation.
