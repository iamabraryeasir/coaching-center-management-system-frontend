import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Extract backend API origin for Content-Security-Policy connect-src
const rawApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const apiOrigin = (() => {
  try {
    return new URL(rawApiUrl).origin;
  } catch {
    return "";
  }
})();

// Build production-hardened CSP directives
const cspDirectives = [
  "default-src 'self'",
  // Next.js App Router hydration & Google OAuth ('unsafe-eval' only in development)
  isProd
    ? "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com"
    : "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
  "frame-src 'self' https://accounts.google.com",
  // Avatars, profile images, data URIs, Cloudinary CDN
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com https://*.googleusercontent.com https://*.cloudinary.com",
  // Connect-src: strictly scoped to same-origin + configured API + Google APIs (local ports only in dev)
  [
    "connect-src 'self'",
    apiOrigin,
    apiOrigin?.startsWith("http:") ? apiOrigin.replace(/^http/, "ws") : "",
    apiOrigin?.startsWith("https:") ? apiOrigin.replace(/^https/, "wss") : "",
    !isProd
      ? "http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*"
      : "",
    "https://accounts.google.com",
    "https://*.googleapis.com",
  ]
    .filter(Boolean)
    .join(" "),
  // Tailwind CSS v4, Google Fonts & Google Identity Services (GSI)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' data: https://fonts.gstatic.com",
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,

  /**
   * Enterprise HTTP Security Headers
   */
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(self)",
      },
      { key: "Content-Security-Policy", value: cspDirectives },
    ];

    // Enforce HSTS (HTTP Strict Transport Security) in production
    if (isProd) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async rewrites() {
    const rawApi =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    if (rawApi.startsWith("http")) {
      return [
        {
          source: "/api/v1/:path*",
          destination: `${rawApi}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
