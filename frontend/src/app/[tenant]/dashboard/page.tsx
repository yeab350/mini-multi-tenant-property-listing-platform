"use client";

import Link from "next/link";
import { useMemo } from "react";
import { isTenantSlug } from "@/lib/tenants";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { TenantSlug } from "@/lib/types";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

export default function DashboardHome({ params }: { params: { tenant: string } }) {
  const tenant = params.tenant;
  const validTenant = useMemo(() => isTenantSlug(tenant), [tenant]);
  const tenantSlug = useMemo(
    () => (validTenant ? (tenant as TenantSlug) : null),
    [tenant, validTenant]
  );
  const { user } = useAuthStore();

  if (!validTenant) {
    return (
      <main>
        <Container className="py-16">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Invalid tenant.</div>
              <Link href="/" className="mt-4 inline-block font-semibold underline">
                Back
              </Link>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <TenantShell tenant={tenantSlug!}>
      <TenantShellSidebar>
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-zinc-900">Quick links</div>
            <div className="mt-4 grid gap-2">
              <Link href={`/${tenant}/properties`} className="font-semibold underline">
                Public listings (SSR)
              </Link>
              <Link href="/" className="font-semibold underline">
                Tenant picker
              </Link>
            </div>
            <div className="mt-4 text-sm text-zinc-600">
              This UI is frontend-only now; NestJS will provide the real auth and data later.
            </div>
          </CardContent>
        </Card>
      </TenantShellSidebar>

      <TenantShellMain>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="accent">Dashboard</Badge>
            <span className="text-xs font-semibold text-zinc-500">Client-rendered</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Your workspace</h1>
          <p className="text-sm text-zinc-600">
            Role-based dashboards with protected routes and tenant theming.
          </p>
        </div>

        <Card className="mt-6">
          <CardContent>
            {user ? (
              <div className="flex flex-col gap-5">
                <div className="text-sm text-zinc-700">
                  Signed in as <span className="font-semibold text-zinc-900">{user.email}</span>{" "}
                  <span className="text-zinc-500">({user.role})</span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {user.role === "user" ? (
                    <ButtonLink href={`/${tenant}/dashboard/user`}>User dashboard</ButtonLink>
                  ) : null}
                  {user.role === "owner" ? (
                    <ButtonLink href={`/${tenant}/dashboard/owner`}>Owner dashboard</ButtonLink>
                  ) : null}
                  {user.role === "admin" ? (
                    <ButtonLink href={`/${tenant}/dashboard/admin`}>Admin dashboard</ButtonLink>
                  ) : null}

                  <ButtonLink href={`/${tenant}/properties`} variant="secondary">
                    Browse properties
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="text-sm text-zinc-700">You’re not logged in.</div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <ButtonLink href={`/${tenant}/auth/login`}>Sign in</ButtonLink>
                  <ButtonLink href={`/${tenant}/auth/register`} variant="secondary">
                    Create account
                  </ButtonLink>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TenantShellMain>
    </TenantShell>
  );
}
