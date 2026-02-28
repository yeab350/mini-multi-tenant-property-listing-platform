"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, LogIn, Shield, Store, User2 } from "lucide-react";
import type { TenantSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import React from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function SidebarNav({ tenant }: { tenant: TenantSlug }) {
  const pathname = usePathname() ?? "";
  const base = `/${tenant}`;

  const items: NavItem[] = [
    { href: base, label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: `${base}/properties`, label: "Browse", icon: <Store className="h-4 w-4" /> },
    { href: `${base}/dashboard`, label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: `${base}/auth/login`, label: "Login", icon: <LogIn className="h-4 w-4" /> },
  ];

  const roleItems: NavItem[] = [
    { href: `${base}/dashboard/user`, label: "User", icon: <User2 className="h-4 w-4" /> },
    { href: `${base}/dashboard/owner`, label: "Owner", icon: <User2 className="h-4 w-4" /> },
    { href: `${base}/dashboard/admin`, label: "Admin", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardContent>
        <div className="text-xs font-semibold text-zinc-600">Navigation</div>

        <div className="mt-3 grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold",
                  active
                    ? "bg-[color-mix(in_oklab,var(--tenant-accent),white_85%)] text-[var(--tenant-accent)]"
                    : "text-zinc-800 hover:bg-white/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 text-xs font-semibold text-zinc-600">Roles</div>
        <div className="mt-3 grid gap-1">
          {roleItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold",
                  active
                    ? "bg-[color-mix(in_oklab,var(--tenant-accent),white_85%)] text-[var(--tenant-accent)]"
                    : "text-zinc-800 hover:bg-white/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-white/20 bg-white/40 p-3 text-xs text-zinc-600">
          Tip: use <span className="font-semibold text-zinc-900">user</span>,{" "}
          <span className="font-semibold text-zinc-900">owner</span>, or{" "}
          <span className="font-semibold text-zinc-900">admin</span> when logging in.
        </div>
      </CardContent>
    </Card>
  );
}

export function TenantShell({
  tenant,
  children,
}: {
  tenant: TenantSlug;
  children: React.ReactNode;
}) {
  const parts = React.Children.toArray(children);
  const sidebarChild = parts.find(
    (child) => React.isValidElement(child) && child.type === TenantShellSidebar
  ) as React.ReactElement<{ children?: React.ReactNode }> | undefined;

  const mainChild = parts.find(
    (child) => React.isValidElement(child) && child.type === TenantShellMain
  ) as React.ReactElement<{ children?: React.ReactNode }> | undefined;

  const extraSidebar = sidebarChild?.props.children;
  const main = mainChild?.props.children ?? children;

  const aside = (
    <div className="grid gap-4">
      <SidebarNav tenant={tenant} />
      {extraSidebar ? <div className="grid gap-4">{extraSidebar}</div> : null}
    </div>
  );

  return (
    <main>
      <Container size="full" className="py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
          <div className="lg:hidden">{aside}</div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">{aside}</div>
          </aside>
          <section className="min-w-0">{main}</section>
        </div>
      </Container>
    </main>
  );
}

export function TenantShellSidebar({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TenantShellMain({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
