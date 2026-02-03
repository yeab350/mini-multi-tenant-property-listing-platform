"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-white/25 backdrop-blur supports-[backdrop-filter]:bg-white/20">
      <Container size="full" className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full shadow-sm"
              style={{ backgroundColor: "#4f46e5" }}
              aria-hidden
            />
            <span className="text-sm font-semibold text-zinc-900">
              Mini Multi-Tenant Property Listing
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <a
              href="#tenants"
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-white/50"
            >
              Tenants
            </a>
            <Link
              href="/alpha-homes"
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-white/50"
            >
              Demo
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
