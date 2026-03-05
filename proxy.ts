
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 requires the function name to be 'proxy'
export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Only split traffic on the landing page
  if (url.pathname !== "/lp") return NextResponse.next();

  // 2. Async Cookie Check (Next.js 16 standard)
  const cookieStore = await req.cookies;
  let variant = cookieStore.get("ab-test-variant")?.value;

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
  }

  // 3. Inject into Query Params for UA/CPA Tracking
  url.searchParams.set("variant", variant);

  let response: NextResponse;

  if (variant === "A") {
    // POC: Masking Test (URL stays yours, content is Example.com)
    response = NextResponse.rewrite(new URL("https://dancebit-next.gistage.com", req.url));
  } else {
    // VARIANT B: Rewrites to your internal Web2Wave path
    response = NextResponse.rewrite(new URL(`https://skin.luvly.care`, req.url));
  }

  // 4. Pin the user to this variant
  response.cookies.set("ab-test-variant", variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 Days
    path: "/",
  });

  return response;
}

// Config must be exported for the matcher to work
export const config = {
  matcher: ["/lp"],
};
