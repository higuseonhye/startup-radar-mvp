import type { Metadata } from "next";
import { PwaRegister } from "@/app/components/pwa-register";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Startup Radar",
  description: "AI-native autonomous startup intelligence system",
  applicationName: "Startup Radar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-zinc-100">
        <PwaRegister />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6">
          <header className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Startup Radar</p>
              <h1 className="text-lg font-semibold text-zinc-100">Autonomous Intelligence System</h1>
            </div>
            <nav className="flex items-center gap-4 text-sm text-zinc-300">
              <Link href="/" className="hover:text-zinc-100">
                Feed
              </Link>
              <Link href="/portfolio" className="hover:text-zinc-100">
                Portfolio
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
