import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Salt matching src/lib/admin/auth.ts
const SALT = "_rankup_session_salt_2026";

async function computeExpectedToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow /admin/login without session
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("rankup_admin_session")?.value;
    const secret = process.env.ADMIN_SECRET_KEY || "rankupadmin2026";
    const expectedToken = await computeExpectedToken(secret);

    if (!sessionCookie || sessionCookie !== expectedToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
