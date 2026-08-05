import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

// Loaded once here rather than per page: a per-component next/font instance
// arrives with that route's async CSS chunk, so client-side navigation flashes
// the fallback sans for a frame. From the root layout the face is in the
// document's first paint on every route.
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andrew Kim",
  description: "Andrew Kim — software engineer in Washington, D.C. An Undertale-inspired portfolio of full-stack, web3, and AI projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className={vt323.className}>{children}</body>
    </html>
  );
}
