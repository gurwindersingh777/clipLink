import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"]
const authRoutes = ["/login", "/signup"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token")

  const isAuthenticated = !!sessionCookie

  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard"],
};