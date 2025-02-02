import { NextResponse } from "next/server";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/menu", "/game"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestSession = pathname === "/game/guest-session";

  if (isProtectedRoute && !isGuestSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
