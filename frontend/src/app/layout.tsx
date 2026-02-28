import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Mini Multi-Tenant Property Listing",
  description: "A mini multi-tenant property listing platform (frontend).",
  openGraph: {
    title: "Mini Multi-Tenant Property Listing",
    description: "A mini multi-tenant property listing platform (frontend).",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mini Multi-Tenant Property Listing",
    description: "A mini multi-tenant property listing platform (frontend).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
