"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PropertyCardClient } from "@/components/PropertyCardClient";
import { isTenantSlug } from "@/lib/tenants";
import { useFavoritesStore } from "@/store/favorites";
import { getPublicPropertyById } from "@/lib/backendApi";
import type { TenantSlug } from "@/lib/types";
import type { Property } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

export default function UserDashboard({ params }: { params: { tenant: string } }) {
  const tenant = params.tenant;
  const validTenant = useMemo(() => isTenantSlug(tenant), [tenant]);
  const tenantSlug = useMemo(
    () => (validTenant ? (tenant as TenantSlug) : null),
    [tenant, validTenant]
  );
  const { favorites } = useFavoritesStore();

  const [favProps, setFavProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const favIds = useMemo(
    () => (tenantSlug ? favorites[tenantSlug] ?? [] : []),
    [favorites, tenantSlug]
  );
  const favIdsKey = useMemo(() => favIds.join("|"), [favIds]);

  useEffect(() => {
    if (!tenantSlug) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
    });

    Promise.all(favIds.map((id) => getPublicPropertyById(tenantSlug, id).catch(() => null)))
      .then((items) => {
        if (cancelled) return;
        setFavProps(items.filter((p): p is Property => p != null));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [favIds, favIdsKey, tenantSlug]);

  if (!tenantSlug) {
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
    <ProtectedRoute tenant={tenantSlug} allow={["user"]}>
      <TenantShell tenant={tenantSlug}>
        <TenantShellSidebar>
          <Card>
            <CardContent>
              <div className="text-sm font-semibold text-zinc-900">Favorites</div>
              <div className="mt-1 text-sm text-zinc-600">
                You’ve saved <span className="font-semibold text-zinc-900">{favIds.length}</span> properties.
              </div>
              <div className="mt-4 grid gap-2">
                <ButtonLink href={`/${tenantSlug}/properties`} variant="secondary" className="h-11">
                  Browse listings
                </ButtonLink>
                <ButtonLink href={`/${tenantSlug}/dashboard`} variant="ghost" className="h-11">
                  Dashboard home
                </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </TenantShellSidebar>

        <TenantShellMain>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge tone="accent">User</Badge>
              <span className="text-xs font-semibold text-zinc-500">Favorites</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Saved properties</h1>
            <p className="text-sm text-zinc-600">
              Favorites persist across refresh and sync across tabs.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favProps.map((p) => (
              <PropertyCardClient key={p.id} tenant={tenantSlug} property={p} />
            ))}
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-zinc-600">Loading favorites…</div>
          ) : null}

          {!loading && favProps.length === 0 ? (
            <Card className="mt-8">
              <CardContent>
                <div className="text-sm font-semibold text-zinc-900">No favorites yet</div>
                <div className="mt-2 text-sm text-zinc-600">
                  Save properties from the listings and they’ll show up here.
                </div>
                <div className="mt-4">
                  <ButtonLink href={`/${tenantSlug}/properties`}>Find properties</ButtonLink>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TenantShellMain>
      </TenantShell>
    </ProtectedRoute>
  );
}
