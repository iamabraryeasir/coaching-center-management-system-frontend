import type { NextConfig } from "next";

// Extract API hostname at build time for Content-Security-Policy connect-src.
// NEXT_PUBLIC_API_BASE_URL must be set in your CI/CD build environment.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiDomain = apiBaseUrl
  ? (() => {
      try {
        return new URL(apiBaseUrl).hostname;
      } catch {
        return "";
      }
    })()
  : "";

const cspDirectives = [
  "default-src 'self'",
  // Google Accounts needed for OAuth button iframe + script
  "script-src 'self' https://accounts.google.com",
  "frame-src https://accounts.google.com",
  // Self + Google profile photos + Cloudinary user avatars
  "img-src 'self' data: https://lh3.googleusercontent.com https://res.cloudinary.com",
  // Restrict fetch/XHR to same origin + the configured API domain
  `connect-src 'self'${apiDomain ? ` https://${apiDomain}` : ""}`,
  // Tailwind CSS v4 uses inline styles — 'unsafe-inline' required
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * HTTP Security Headers
   *
   * Applied to every route. These headers protect against:
   * - Clickjacking (X-Frame-Options)
   * - MIME sniffing attacks (X-Content-Type-Options)
   * - XSS via injected scripts (Content-Security-Policy)
   * - Referrer leakage of auth URLs (Referrer-Policy)
   * - Unnecessary browser API exposure (Permissions-Policy)
   * - HTTP downgrade attacks (Strict-Transport-Security)
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
          { key: "Content-Security-Policy", value: cspDirectives },
          {
            // HSTS: enforce HTTPS for 1 year, including subdomains
            // Only set this if your app is exclusively served over HTTPS
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      // Google OAuth profile photos — specific subdomain, NOT wildcard
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Cloudinary CDN — user-uploaded avatar storage
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
