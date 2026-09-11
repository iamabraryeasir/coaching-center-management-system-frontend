<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Memory & Development Guide: Coaching Management System Frontend

This document serves as the persistent memory, architectural specification, and coding standard for all AI agents working on this repository.

---

## 1. Project Overview

- **Project Name**: `coaching-management-system-frontend`
- **Domain**: Coaching Center Management Application (Student Onboarding, Authentication, Marketing, Administration Dashboard).
- **Package Manager**: `bun` (`bun@1.4.2`). Always prefer `bun` for package management and running scripts.
- **Core Stack**:
  - **Framework**: Next.js 16.3.4 (App Router) + React 19.2.8
  - **Compiler**: React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
  - **Styling**: Tailwind CSS v4 + `tw-animate-css` + OKLCH design tokens
  - **UI Primitives**: Base UI (`@base-ui/react`) + Shadcn (`base-nova` style) + Lucide Icons
  - **State & Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) + `ofetch`
  - **Forms & Validation**: `@tanstack/react-form` + `zod` (v4)
  - **Linter & Formatter**: Biome 2.4.2 (`biome.json`)

---

## 2. Directory Structure & Responsibilities

All application source code lives inside `src/`. Follow the strict separation of concerns below:

```plaintext
src/
├── api/                  # HTTP client (ofetch) instances, API service functions, endpoint definitions
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── (public)/         # Route group for unauthenticated/public-facing routes
│   │   ├── (auth)/       # Auth screens (/login, /forgot-password, /onboard-student)
│   │   └── (marketing)/  # Marketing pages (/ with Header & Footer layout)
│   ├── dashboard/        # Authenticated coaching center management dashboard
│   ├── globals.css       # Tailwind v4 theme, OKLCH variables, light/dark mode tokens
│   └── layout.tsx        # Root HTML layout with Google Fonts (Geist, Inter, Roboto)
├── assets/               # Static icons, vector graphics, and SVG components
│   └── svg/              # Reusable React SVG components (e.g., logo.tsx)
├── components/           # Component hierarchy
│   ├── forms/            # Form components powered by @tanstack/react-form and Zod
│   ├── layouts/          # Layout shells (e.g. public/header.tsx, public/footer.tsx, dashboard/sidebar.tsx)
│   ├── modules/          # Domain-specific feature modules (e.g. home-page/hero-section.tsx)
│   └── ui/               # Low-level reusable UI primitives (e.g. button.tsx with @base-ui/react)
├── constants/            # App-wide constants, navigation links, route mappings
├── hooks/                # Custom reusable React hooks
├── lib/                  # Utilities (e.g. utils.ts with cn helper)
├── providers/            # Client context providers (QueryClientProvider, ThemeProvider, etc.)
├── types/                # TypeScript interfaces, DTOs, API response types
└── validators/           # Zod validation schemas
```

---

## 3. Architecture & Coding Patterns

### 3.1 Next.js 16 & React 19 Conventions

- **Server-First Principle**: Keep components as React Server Components (RSC) by default. Only add `"use client"` when using hooks, browser APIs, or interactive event listeners.
- **React Compiler Active**: Because `reactCompiler: true` is enabled, avoid manually wrapping callbacks in `useCallback` or computations in `useMemo` unless dealing with external imperative references.
- **Async Page & Layout Params**: In Next.js 15/16, `params` and `searchParams` in pages, layouts, and route handlers are Promises. Always await them:
  ```tsx
  export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
    const { id } = await params;
    const query = await searchParams;
    // ...
  }
  ```
- **Thin Route Pages**: Page files (`page.tsx`) must remain minimal wrappers that fetch data or assemble feature modules from `src/components/modules/<feature-name>/`.

### 3.2 UI Components & Styling (Tailwind v4 + Base UI)

- **Base UI Primitives**: Reusable UI components in `src/components/ui/` should build upon `@base-ui/react` primitives and `class-variance-authority` (`cva`).
- **Design Tokens & OKLCH**: Use the defined semantic theme variables in `src/app/globals.css` (`bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-card`, `border-border`, etc.).
- **Dark Mode**: Configured via `@custom-variant dark (&:is(.dark *));` and `.dark` CSS class tokens. Ensure all UI components support dark mode cleanly.
- **Class Merging**: Always use `cn(...)` from `@/lib/utils` (or `cn`) for merging dynamic Tailwind classes.

### 3.3 Data Fetching & API Layer

- **HTTP Client**: Use `ofetch` for API communication. Set up a base client with interceptors for authentication tokens and base URLs (`NEXT_PUBLIC_BASE_URL`).
- **Server State**: Use `@tanstack/react-query` for all client-side querying, caching, and mutations.
- **Query Keys**: Centralize query key factories in `src/constants/` or co-locate with query hooks to prevent stale cache bugs.

### 3.4 Form Handling & Validation

- **Form State**: Use `@tanstack/react-form` for form state management.
- **Schema Validation**: Define all schemas in `src/validators/` using `zod` (v4).
- **Type Inference**: Infer TypeScript types directly from schemas using `z.infer<typeof schema>` and export them from `src/types/` or the validator file.

---

## 4. Code Quality & Tooling Rules

- **Biome (Linter & Formatter)**:
  - Do NOT add ESLint or Prettier configs. Biome manages all linting and formatting.
  - Tab/Indent: 2 spaces.
  - Quotes: Double quotes for JS/TS/JSON.
- **Path Aliases**: Always use `@/*` alias pointing to `src/*` (configured in `tsconfig.json` and `components.json`):
  - `@/components`
  - `@/components/ui`
  - `@/lib/utils`
  - `@/hooks`
  - `@/types`
  - `@/validators`
  - `@/constants`
  - `@/api`
  - `@/providers`
- **TypeScript Strict Mode**: Keep code 100% strictly typed. Never use `any` without documented necessity.

---

## 5. Agent Workflow & Operational Instructions

1. **Check Existing Dependencies**: Before suggesting or installing new packages, verify if an existing tool in `package.json` already fulfills the requirement (`ofetch`, `@tanstack/react-query`, `@tanstack/react-form`, `zod`, `@base-ui/react`, `lucide-react`, `cva`).
2. **Preserve Next.js Agent Header**: Never delete or tamper with the `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` block at the top of this file.
3. **Keep Modules Cohesive**: Place feature-specific UI inside `src/components/modules/<feature-slug>/` rather than cluttering `src/components/ui/` or `src/app/`.
4. **Mandatory Post-Task Code Quality Pipeline**: Whenever the agent writes, edits, or adds code to the codebase, it **MUST** run the following 3 commands in order to ensure clean, valid, and formatted code:
   - **Step 1: Check Linter**: `bun run lint` (runs `biome check` to detect issues)
   - **Step 2: Auto-fix Issues**: `bun run lint:write` (runs `biome check --write` to auto-fix linter and import sorting issues)
   - **Step 3: Format Code**: `bun run format` (runs `biome format --write` to apply consistent code formatting)
