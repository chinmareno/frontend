import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const publicUrls = ["/reset"];

  if (publicUrls.includes(req.nextUrl.pathname)) {
    return res;
  }
}
