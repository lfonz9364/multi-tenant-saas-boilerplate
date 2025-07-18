import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
]);

import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next(); // ✅ prevent breakage
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/api/:path*"],
};
