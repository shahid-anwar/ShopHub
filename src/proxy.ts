import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  // protect checkout and orders — must be logged in
  if (!isLoggedIn && pathname.startsWith("/checkout")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isLoggedIn && pathname.startsWith("/orders")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // protect admin — must be admin role
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
