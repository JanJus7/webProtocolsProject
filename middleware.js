import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/menu", "/game"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const userId = cookies().get("userId")?.value;
  const isGuestSession = pathname === "/game/guest-session";

  if (isProtectedRoute && !userId && !isGuestSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}