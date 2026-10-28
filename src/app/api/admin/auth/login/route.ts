import { NextResponse } from "next/server";
import { getExpectedAdminToken, validateAdminPassword, ADMIN_COOKIE_NAME } from "@/lib/admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin secret key. Please check your credentials." },
        { status: 401 }
      );
    }

    const token = getExpectedAdminToken();
    const response = NextResponse.json({ success: true, message: "Admin authenticated successfully." });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to process login request." }, { status: 500 });
  }
}
