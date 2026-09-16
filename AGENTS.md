<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Memory & Engineering Guidelines: Coaching Management System Frontend

This document serves as the persistent memory, architectural blueprint, and engineering standard for all AI agents and developers working on this codebase.

---

## 1. System Overview & Core Stack

- **Application Domain**: Coaching Management System (Multi-tenant/multi-instance coaching center administration, onboarding, authentication, and marketing).
- **Package Manager & Runtime**: `bun` (`bun@1.4.2`). Always use `bun` for installing packages and executing scripts.
- **Core Technology Matrix**:
  - **Framework**: Next.js 16 (App Router) + React 19
  - **Compiler**: React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
  - **Styling**: Tailwind CSS v4 + `tw-animate-css` + Semantic OKLCH design tokens
  - **UI Primitives**: Base UI (`@base-ui/react`) + Shadcn (`base-nova` style) + Lucide Icons
  - **Data Fetching & Server State**: TanStack Query v5 (`@tanstack/react-query`) + `ofetch`
  - **Forms & Schema Validation**: `@tanstack/react-form` + `zod` (v4)
  - **Feedback & Notifications**: `react-hot-toast` + OKLCH token styling
  - **Linter & Formatter**: Biome 2.4.2 (`biome.json`)

---

## 2. Architectural Blueprint & Directory Taxonomy

All application code resides within `src/` and strictly adheres to the following separation of concerns:

```plaintext
src/
├── api/                  # HTTP client instances (ofetch), centralized endpoint services, and API contracts
├── app/                  # Next.js App Router (route groups, layouts, pages, route handlers)
│   ├── (public)/         # Unauthenticated route groups
│   │   ├── (auth)/       # Authentication & credential recovery flows
│   │   └── (marketing)/  # Marketing, landing, and public-facing content
│   ├── dashboard/        # Authenticated management & administrative portal
│   ├── globals.css       # Tailwind v4 engine, semantic OKLCH tokens, dark theme variables
│   └── layout.tsx        # Root HTML shell injecting font variables, site metadata, and global providers
├── assets/               # Static icons, vector graphics, and reusable SVG components
├── components/           # 5-Tier Component Composition Hierarchy (see DESIGN.md)
│   ├── forms/            # Reusable form field controls and form containers
│   ├── layouts/          # Global layout shells (headers, navigation bars, sidebars, footers)
│   ├── modules/          # Domain-bounded feature modules (cohesive business logic slices)
│   └── ui/               # Atomic, headless UI primitives built on Base UI + CVA
├── config/               # Centralized configuration (site identity, branding, white-label settings)
├── constants/            # Application-wide constants, navigation schemes, route enumerations
├── hooks/                # Custom, reusable React hooks
├── lib/                  # Universal utility functions (e.g., class name merger cn, ofetch apiClient)
├── providers/            # React Context & Client state providers (QueryClientProvider, ToastProvider, Auth)
├── types/                # Domain models, TypeScript interfaces, DTOs, and API responses
└── validators/           # Zod validation schemas and schema-inferred types
```

---

## 3. Design System & UI Architecture Reference

For detailed specifications on visual tokens, typography, component composition tiers, and layout archetypes, **always refer to [`DESIGN.md`](./DESIGN.md)**.

Key principles to uphold:

- **Token Exclusivity**: Use semantic CSS tokens (`bg-primary`, `text-foreground`, `border-border`, etc.) instead of hardcoded hex colors or arbitrary values.
- **Component Layering**: Maintain clear boundaries between atomic UI primitives (`components/ui`), validated form controls (`components/forms`), layout frames (`components/layouts`), and feature modules (`components/modules/<feature-domain>`).
- **Dark Mode & Contrast**: All components must provide first-class dark mode support using defined semantic tokens and OKLCH color dynamics.

---

## 4. Universal Development & Coding Standards

### 4.1 Next.js 16 & React 19 Paradigms

- **Server-First Execution**: Default to React Server Components (`RSC`). Add `"use client"` only when components require browser APIs, local state, effects, or user event listeners.
- **React Compiler Optimization**: With `reactCompiler: true` active, do not manually wrap calculations in `useMemo` or handlers in `useCallback` unless handling external non-reactive imperative references.
- **Async Page & Layout Parameters**: `params` and `searchParams` in Next.js 16 pages, layouts, and route handlers are Promises. Always await them:
  ```tsx
  export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
    const { slug } = await params;
    const query = await searchParams;
    // ...
  }
  ```
- **Thin Route Pages**: Route page files (`page.tsx`) must serve purely as thin orchestrators that fetch data or assemble feature modules from `src/components/modules/<feature-domain>/`.

### 4.2 Centralized Branding & Multi-Deployment (White-Label) Architecture

- **Single Source of Truth**: All application identity strings (center name, short name, tagline, description, logo URL, support email) are centralized in `src/config/site.ts`.
- **Zero Hardcoded Branding**: Never hardcode brand names, titles, or logo paths inside components, layouts, or pages. Always import `siteConfig` from `@/config/site`:

  ```tsx
  import { siteConfig } from "@/config/site";

  // Use in headers, sidebars, footers, auth titles, and metadata
  <span>{siteConfig.name}</span>;
  ```

- **Multi-Deployment Customization**: When deploying for different coaching centers, brand properties can be overridden via `NEXT_PUBLIC_*` environment variables (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_LOGO_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`) without code changes.

### 4.3 Data Fetching & API Layer

- **HTTP Client**: Use `ofetch` for API interaction with centralized base configuration, token management, and error handling.
- **Server State Management**: Handle all client-side querying, caching, and mutations via `@tanstack/react-query`.
- **Query Key Factories**: Centralize query key factories in `src/constants/` or co-locate with query hooks to prevent stale cache discrepancies.

### 4.4 Form State & Validation

- **Form State**: Manage interactive forms using `@tanstack/react-form`.
- **Schema Validation**: Define all schemas in `src/validators/` with `zod` (v4).
- **Type Derivation**: Infer TypeScript DTOs from schemas (`z.infer<typeof schema>`) and export them for cross-tier consumption.

### 4.5 Notifications & User Feedback

- **Toast Engine**: Use `react-hot-toast` for all status notifications and action feedback.
- **Global Provider**: Rendered globally via `src/providers/toast-provider.tsx` inside `AppProviders`.
- **Async Action Pattern**: When executing async mutations or form submits, use `toast.loading(...)` with an ID, then update the same toast with `toast.success(..., { id: toastId })` or `toast.error(..., { id: toastId })`.

### 4.6 TypeScript & Code Quality

- **Strict Type Safety**: Maintain 100% strict typing. Never introduce `any` types.
- **Module Aliases**: Always use `@/*` path aliases pointing to `src/*` (e.g., `@/components/ui`, `@/config/site`, `@/lib/utils`, `@/types`, `@/api`).
- **Single Tooling System (Biome)**: Never add ESLint, Prettier, or conflicting config files. Biome is the sole linter and formatter.

### 4.7 Next.js 16 Routing Proxy (`src/proxy.ts`) & Production Auth Architecture

- **Next.js 16 `src/proxy.ts` Convention**: In Next.js 16, `middleware.ts` is deprecated and replaced by `src/proxy.ts`. It executes on the server before routes are rendered for zero-flash route protection and redirection (e.g., `/dashboard/:path*`, `/login`).
- **Secure HttpOnly Cookie Model**: Authentication tokens (`accessToken` 15m, `refreshToken` 30d) are stored exclusively in HttpOnly cookies and sent via `credentials: "include"`. Zero tokens in `localStorage`.
- **Silent Refresh & Concurrency Queuing**: When access tokens expire, `apiClient` (`src/lib/api-client.ts`) initiates a single atomic call to `POST /auth/refresh-token`, queuing concurrent requests in `failedQueue` and seamlessly replaying them upon refresh.
- **Network Error Resilience**: Never log the user out on network drops, offline status, or 5xx errors. Only explicit HTTP 401 or 403 responses from the refresh endpoint trigger `auth:session-expired`.
- **Multi-Tab Synchronization**: Uses `BroadcastChannel` (`src/lib/auth-channel.ts`) to immediately synchronize `LOGIN`, `LOGOUT`, and `SESSION_EXPIRED` events across all open browser tabs without manual page reloads.
- **Context Preservation**: Unauthenticated and expired session redirects must preserve the intended destination URL via `?redirect=...`.

---

## 5. Agent Operational Workflow & Quality Pipeline

Whenever working on tasks in this repository, all agents **MUST** adhere to the following sequence:

1. **Dependency Verification**: Check `package.json` before adding any new libraries. Always utilize existing dependencies (`ofetch`, `@tanstack/react-query`, `@tanstack/react-form`, `zod`, `@base-ui/react`, `react-hot-toast`, `lucide-react`, `cva`).
2. **Next.js Header Preservation**: Never remove or alter the `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` block at the top of this file.
3. **Feature Encapsulation**: Keep feature-specific logic within `src/components/modules/<feature-domain>/` to preserve a clean and scalable component hierarchy.
4. **Mandatory Post-Task Code Quality Pipeline**:
   After writing, modifying, or refactoring any code, the agent **MUST** execute the following 3 commands in order:
   - **Step 1: Check Linter**: `bun run lint` (runs `biome check` to detect issues)
   - **Step 2: Auto-fix Issues**: `bun run lint:write` (runs `biome check --write` to auto-fix linter and import sorting issues)
   - **Step 3: Format Code**: `bun run format` (runs `biome format --write` to apply consistent code formatting)
