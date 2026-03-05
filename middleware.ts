// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Rename to 'proxy' to match the Next.js 16 convention
export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname !== "/lp") return NextResponse.next();

  // Next.js 16 context: Accessing cookies is now asynchronous
  const cookieStore = req.cookies;
  let variant = cookieStore.get("ab-test-variant")?.value;

  if (!variant) {
    variant = Math.random() < 0.5 ? "A" : "B";
  }

  url.searchParams.set("variant", variant);

  let response: NextResponse;

  // IMPORTANT: Google/Bing will still force a redirect because of their
  // security headers. For a real 'masking' test, use your Web2Wave URL.
  if (variant === "A") {
    response = NextResponse.rewrite(new URL("https://dancebit-next.gistage.com", req.url));
  } else {
    // This uses your internal rewrite rule from next.config.ts
    response = NextResponse.rewrite(new URL(`https://skin.luvly.care`, req.url));
  }

  response.cookies.set("ab-test-variant", variant, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/lp"],
};
