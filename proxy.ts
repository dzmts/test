import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Only act on the landing page path
  if (url.pathname !== "/lp") return NextResponse.next();

  // 2. Bucket the user — check cookie first, then assign randomly
  let variant = req.cookies.get("ab-test-variant")?.value;
  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
  }

  // 3. Inject the variant as a query parameter.
  //    This preserves all original params (gclid, utms, fbclid, etc.) and appends &variant=X.
  url.searchParams.set("variant", variant);

  let response: NextResponse;

  if (variant === "A") {
    response = NextResponse.rewrite(new URL("https://google.com", req.url));
  } else {
    response = NextResponse.rewrite(new URL("https://bing.com", req.url));
  }

  // 4. Persist the assigned variant in a cookie as a fallback for subsequent page loads
  response.cookies.set("ab-test-variant", variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}

export const config = {
  // Run this proxy only for the landing page
  matcher: ["/lp"],
};
