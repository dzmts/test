import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AB Test Splitter",
  description: "Vercel edge proxy for A/B variant routing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
