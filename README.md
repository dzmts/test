# ws-ab-test-splitter

A Vercel Edge Proxy (zero-redirect) that A/B splits traffic between two funnels while injecting a `?variant=` query parameter into every forwarded request, so you keep a perfect data trail for ad-platform CPA analysis.

## How it works

```
Browser → your-proxy.vercel.app/lp?utm_source=meta
              │
              ▼  (Edge, ~30 ms)
         middleware.ts
              │
              ├── variant=A  →  rewrite → https://custom-funnel.brand.com/lp?utm_source=meta&variant=A
              └── variant=B  →  rewrite → /web2wave-internal?utm_source=meta&variant=B
                                              │
                                              └── next.config.ts rewrite → https://your-funnel.web2wave.com/
```

- **No redirect** — Vercel rewrites the request internally; the browser URL never changes (200 OK on your domain).  
- **Immutable variant** — The chosen variant is written as both a cookie (30-day fallback) and a `?variant=` query parameter so it survives Meta / TikTok in-app browser → Safari hand-offs.  
- **Ad-signal safe** — `fbclid`, `gclid`, `utm_*` and every other query parameter are preserved unchanged.

## Configuration

| Placeholder | File | Replace with |
|---|---|---|
| `https://your-funnel.web2wave.com` | `next.config.ts` | Your Web2Wave funnel URL |
| `https://custom-funnel.brand.com` | `middleware.ts` | Your custom funnel URL |
| `/lp` | `middleware.ts` | The landing page path you want to split |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/lp](http://localhost:3000/lp) to test the proxy locally.

## Deployment

Push to GitHub and connect to a Vercel project — no additional configuration is required.
