import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 Server-Side Routing Proxy
 *
 * Runs on the server edge before routes are rendered to enforce immediate,
 * zero-flash route protection and redirection.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasAuthCookie =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  // Protected Route Guard (/dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!hasAuthCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth Page Guard (/login, /forgot-password)
  // If user is already authenticated, redirect them away from auth screens to dashboard
  if (
    hasAuthCookie &&
    (pathname === "/login" || pathname === "/forgot-password")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/forgot-password"],
};
