import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // If the user does not have a token, redirect to the login page
  if (!token) {
    if (req.nextUrl.pathname !== "/auth/customer-login") {
      return NextResponse.redirect(new URL("/auth/customer-login", req.url));
    }
    return NextResponse.next();
  }

  // If the user is already logged in and attempts to access "/", redirect them directly to the appropriate dashboard
  if (req.nextUrl.pathname === "/") {
    if (role === "customer") {
      return NextResponse.redirect(new URL("/dashboard/customer", req.url));
    } else if (role === "employee") {
      return NextResponse.redirect(new URL("/dashboard/employee", req.url));
    } else if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  // Protection to ensure users can only access the dashboard corresponding to their role
  if (req.nextUrl.pathname.startsWith("/dashboard/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/dashboard/employee") && role !== "employee") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/customer-login", req.url));
  }

  return NextResponse.next();
}

// Protect all dashboard pages
export const config = {
  matcher: ["/", "/dashboard/:path*"], 
};