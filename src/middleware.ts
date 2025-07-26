import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET! });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    if (!req.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
