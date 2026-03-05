// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CRITICAL: Function MUST be named 'middleware'
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Only act on the landing page path
  if (url.pathname !== "/lp") return NextResponse.next();

  // 2. Bucket Logic
  let variant = req.cookies.get("ab-test-variant")?.value;

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
    console.log(`New user assigned to variant: ${variant}`);
  }

  url.searchParams.set("variant", variant);

  let response: NextResponse;

  if (variant === "A") {
    // TEST: Use example.com instead of Google (Google blocks rewrites)
    response = NextResponse.rewrite(new URL("https://skin.luvly.care/", req.url));
  } else {
    // TEST: Use a different simple site or your internal rewrite path
    response = NextResponse.rewrite(new URL("https://https://dancebit-next.gistage.com/", req.url));
  }

  // 3. Set the cookie on the RESPONSE, not the request
  response.cookies.set("ab-test-variant", variant, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/lp"],
};
