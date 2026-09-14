# Coaching Management System (Frontend)

A modern, scalable frontend application for managing coaching centers, student admissions, batches, attendance, exams, and fee collections.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Compiler**: React Compiler enabled
- **Package Manager**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://www.npmjs.com/package/tw-animate-css) + Semantic OKLCH design tokens
- **UI Primitives**: [Base UI](https://base-ui.com/) (`@base-ui/react`) + Shadcn (`base-nova`) + Lucide Icons
- **Server State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) + [ofetch](https://github.com/unjs/ofetch)
- **Forms & Validation**: [TanStack Form](https://tanstack.com/form/latest) + [Zod](https://zod.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Linter & Formatter**: [Biome](https://biomejs.dev/)

---

## 📁 Key Features & Architecture

- **Multi-Instance White-Label Ready**: Centralized branding in `src/config/site.ts` with zero-code environment variable overrides (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_LOGO_URL`, etc.).
- **Modular Component Taxonomy**: Structured separation of concerns between UI primitives (`src/components/ui`), form controls (`src/components/forms`), layout frames (`src/components/layouts`), and feature modules (`src/components/modules`).
- **Modern Routing Architecture**: Grouped routing for marketing pages `(marketing)`, authentication flows `(auth)`, and protected management dashboards `dashboard`.
- **Toast Notification Layer**: Unified async status feedback (loading, success, error) styled via OKLCH design tokens.
- **High-Performance Tooling**: Ultra-fast linting and formatting via Biome.

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have [Bun](https://bun.sh/) installed (`>= 1.2.0`).

### 2. Installation

Clone the repository and install dependencies:

```bash
bun install
```

### 3. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env.local
```

### 4. Running the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Scripts

- `bun run dev` - Start local development server
- `bun run build` - Build production bundle
- `bun run start` - Start production server
- `bun run lint` - Run Biome linter check
- `bun run lint:write` - Auto-fix lint and import sorting issues
- `bun run format` - Format code with Biome

---

## 📖 Architecture & Design Documentation

- [AGENTS.md](./AGENTS.md) - Engineering guidelines, architecture blueprint, and agent memory
- [DESIGN.md](./DESIGN.md) - Design system specification, OKLCH tokens, and UI component hierarchy
