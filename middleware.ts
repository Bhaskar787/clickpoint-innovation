import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(req: NextRequest) {
  const sessionToken = getSessionCookie(req);
  const path = req.nextUrl.pathname;

  const isAuthRoute = path === "/admin" || path === "/admin/login";

  // If not logged in and trying to access protected dashboard, redirect to /admin
  if (!sessionToken && path.startsWith("/admin/dashboard")) {
    const loginUrl = new URL("/admin", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and visiting login route /admin or /admin/login, redirect to /admin/dashboard
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};