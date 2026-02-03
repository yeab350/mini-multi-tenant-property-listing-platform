"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Shield, User2 } from "lucide-react";
import type { Tenant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Navbar({ tenant }: { tenant: Tenant }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const base = `/${tenant.slug}`;

  const nav = [
    { href: `${base}/properties`, label: "Browse" },
    { href: `${base}/dashboard`, label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={base} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full shadow-sm"
              style={{ backgroundColor: tenant.accent }}
              aria-hidden
            />
            <span className="text-sm font-semibold text-zinc-900">{tenant.name}</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100",
                    active &&
                      "bg-[color-mix(in_oklab,var(--tenant-accent),white_85%)] text-[var(--tenant-accent)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-sm text-zinc-700 sm:flex">
                {user.role === "admin" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <User2 className="h-4 w-4" />
                )}
                <span className="truncate max-w-[220px]">{user.email}</span>
                <Badge tone={user.role === "admin" ? "danger" : "neutral"}>{user.role}</Badge>
              </div>
              <Button onClick={logout} variant="secondary" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <ButtonLink href={`${base}/auth/login`}>Login</ButtonLink>
          )}
        </div>
        </div>
      </Container>
    </header>
  );
}
