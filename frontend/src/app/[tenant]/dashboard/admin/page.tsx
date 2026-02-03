"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { formatCurrency } from "@/lib/format";
import { isTenantSlug } from "@/lib/tenants";
import type { Property } from "@/lib/types";
import type { TenantSlug } from "@/lib/types";
import { getAdminMetrics, listAdminProperties, toggleDisabledProperty } from "@/lib/backendApi";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

export default function AdminDashboard({ params }: { params: { tenant: string } }) {
  const tenant = params.tenant;
  const validTenant = useMemo(() => isTenantSlug(tenant), [tenant]);
  const tenantSlug = useMemo(
    () => (validTenant ? (tenant as TenantSlug) : null),
    [tenant, validTenant]
  );

  const { accessToken } = useAuthStore();
  const [rows, setRows] = useState<Property[]>([]);
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof getAdminMetrics>> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantSlug) return;
    if (!accessToken) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
    });

    listAdminProperties(tenantSlug, accessToken)
      .then((items) => {
        if (cancelled) return;
        setRows(items);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load properties.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    getAdminMetrics(tenantSlug, accessToken)
      .then((m) => {
        if (cancelled) return;
        setMetrics(m);
      })
      .catch(() => {
        // Non-blocking: metrics are optional for UI.
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, tenantSlug]);

  if (!tenantSlug) {
    return (
      <main>
        <Container className="py-16">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Invalid tenant.</div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  const publishedCount = rows.filter((p) => p.status === "published").length;
  const disabledCount = rows.filter((p) => p.disabled).length;

  return (
    <ProtectedRoute tenant={tenantSlug} allow={["admin"]}>
      <TenantShell tenant={tenantSlug}>
        <TenantShellSidebar>
          <Card>
            <CardContent>
              <div className="text-sm font-semibold text-zinc-900">At a glance</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-3">
                  <div className="text-xs font-semibold text-zinc-600">Total</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-900">{rows.length}</div>
                </div>
                <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-3">
                  <div className="text-xs font-semibold text-zinc-600">Published</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-900">{publishedCount}</div>
                </div>
                <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-3">
                  <div className="text-xs font-semibold text-zinc-600">Disabled</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-900">{disabledCount}</div>
                </div>

                {metrics ? (
                  <>
                    <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-3">
                      <div className="text-xs font-semibold text-zinc-600">Users</div>
                      <div className="mt-1 text-2xl font-semibold text-zinc-900">
                        {metrics.users.total}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-3">
                      <div className="text-xs font-semibold text-zinc-600">Favorites</div>
                      <div className="mt-1 text-2xl font-semibold text-zinc-900">
                        {metrics.favorites.total}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TenantShellSidebar>

        <TenantShellMain>
          <div className="flex items-center gap-2">
            <Badge tone="accent">Admin</Badge>
            <span className="text-xs font-semibold text-zinc-500">Moderation</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Platform overview
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            View all properties, disable any property, and basic metrics.
          </p>

          <Card className="mt-8 overflow-hidden">
            <CardHeader className="bg-white/30">
              <div className="text-sm font-semibold text-zinc-900">All properties</div>
              <div className="mt-1 text-xs text-zinc-600">
                Disable any listing (persisted in Postgres).
              </div>
            </CardHeader>

            {loading ? (
              <div className="px-6 py-4 text-sm text-zinc-600">Loading…</div>
            ) : null}
            {error ? (
              <div className="px-6 py-4 text-sm text-red-600">{error}</div>
            ) : null}

            <div className="grid grid-cols-12 gap-2 border-b border-zinc-200/70 bg-zinc-50/60 px-6 py-3 text-xs font-semibold text-zinc-600">
              <div className="col-span-5">Property</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {rows.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 gap-2 px-6 py-4 text-sm text-zinc-800 border-b border-zinc-100 last:border-b-0"
              >
                <div className="col-span-5">
                  <div className="font-semibold text-zinc-900">{p.title}</div>
                  <div className="mt-1 text-xs text-zinc-600">{formatCurrency(p.price)}</div>
                </div>
                <div className="col-span-3 text-zinc-700">{p.location}</div>
                <div className="col-span-2">
                  <Badge tone={p.disabled ? "danger" : "neutral"}>
                    {p.disabled ? "disabled" : p.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (!accessToken) return;
                      const before = rows;
                      setRows((current) =>
                        current.map((row) =>
                          row.id === p.id ? { ...row, disabled: !row.disabled } : row
                        )
                      );

                      void toggleDisabledProperty(tenantSlug, accessToken, p.id)
                        .then((updated) => {
                          setRows((current) =>
                            current.map((row) => (row.id === p.id ? updated : row))
                          );
                        })
                        .catch(() => setRows(before));
                    }}
                  >
                    {p.disabled ? "Enable" : "Disable"}
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </TenantShellMain>
      </TenantShell>
    </ProtectedRoute>
  );
}
