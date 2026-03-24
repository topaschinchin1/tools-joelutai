import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Public routes that do NOT require authentication.
 * Everything else redirects to /auth if no session is found.
 */
const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/blog",
  "/benchvoice.html",
];

function isPublicPath(pathname: string): boolean {
  // Exact match on public roots
  if (PUBLIC_PATHS.includes(pathname)) return true;

  // Allow all sub-paths under public prefixes
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/blog/")) return true;

  // Static assets & Next.js internals — always public
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/images/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff2?|ttf|webp|json|xml|txt)$/)) return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── Landing page: benchvoice.joelutai.com root → static HTML ──
  if (pathname === "/" && host.includes("benchvoice")) {
    return NextResponse.rewrite(new URL("/benchvoice.html", request.url));
  }

  // ── Public routes: allow through without auth ──
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ── Protected routes: check for session cookie ──
  const hasSession =
    request.cookies.has("sb-access-token") ||
    request.cookies.has("sb-refresh-token") ||
    request.cookies.has("supabase-auth-token") ||
    // Next.js Supabase SSR cookie pattern: sb-<project-ref>-auth-token
    Array.from(request.cookies.getAll()).some((c) =>
      c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );

  if (!hasSession) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
