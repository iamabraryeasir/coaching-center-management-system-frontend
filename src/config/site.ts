/**
 * Centralized Site & Brand Configuration
 *
 * Single source of truth for application identity, branding, and metadata.
 * Designed for multi-deployment white-labeling: override values via environment variables.
 */
export const siteConfig = {
  // Brand Identity
  name: process.env.NEXT_PUBLIC_APP_NAME || "Coaching Management System",
  shortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME || "CMS",
  tagline:
    process.env.NEXT_PUBLIC_APP_TAGLINE ||
    "Coaching Center Operations & Student Management Portal",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "Next-generation coaching management platform for managing students, batches, attendance, exams, and fees.",

  // Assets
  logo: {
    src: process.env.NEXT_PUBLIC_LOGO_URL || "/branding/logo.svg",
    alt: process.env.NEXT_PUBLIC_APP_NAME || "Coaching Management System Logo",
  },
  favicon: "/favicon.ico",

  // Support & Contact
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@coaching.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+880 1700-000000",
  campusAddress:
    process.env.NEXT_PUBLIC_CAMPUS_ADDRESS ||
    "Chattagram Central Campus, Academic Avenue, Bangladesh",

  // Operational Defaults
  defaultCurrency: process.env.NEXT_PUBLIC_CURRENCY || "BDT (৳)",
  academicYear: process.env.NEXT_PUBLIC_ACADEMIC_YEAR || "2026-2027",
} as const;

export type SiteConfig = typeof siteConfig;
