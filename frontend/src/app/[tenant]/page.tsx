import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/tenants";
import { getPublicPropertyStats, listPublicProperties } from "@/lib/backendApi";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

export default async function TenantHome({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const t = getTenant(tenant);
  if (!t) notFound();

  const [stats, featuredResult] = await Promise.all([
    getPublicPropertyStats(t.slug),
    listPublicProperties(t.slug, { page: 1, pageSize: 3 }),
  ]);

  const featured = featuredResult.items;
  const minPrice = stats.minPrice;
  const maxPrice = stats.maxPrice;

  return (
    <TenantShell tenant={t.slug}>
      <TenantShellSidebar>
        <Card className="overflow-hidden">
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Quick actions</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    Jump straight into the required screens.
                  </div>
                </div>
                <span
                  className="h-10 w-10 rounded-2xl"
                  style={{
                    background:
                      "color-mix(in oklab, var(--tenant-accent), white 80%)",
                  }}
                  aria-hidden
                />
              </div>

              <div className="grid gap-2">
                <Link
                  href={`/${t.slug}/properties`}
                  className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
                >
                  Public listing (SSR)
                </Link>
                <Link
                  href={`/${t.slug}/dashboard/user`}
                  className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
                >
                  User dashboard (favorites)
                </Link>
                <Link
                  href={`/${t.slug}/dashboard/owner`}
                  className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
                >
                  Owner dashboard (draft/publish)
                </Link>
                <Link
                  href={`/${t.slug}/dashboard/admin`}
                  className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
                >
                  Admin dashboard (disable/metrics)
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </TenantShellSidebar>

      <TenantShellMain>
        <div className="flex flex-col gap-6">
          <div>
            <Badge tone="accent">{t.name}</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Find your next place
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              {t.tagline} Browse published properties, save favorites, and preview
              owner/admin workflows.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${t.slug}/properties`}>Browse properties</ButtonLink>
              <ButtonLink href={`/${t.slug}/auth/login`} variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href={`/${t.slug}/dashboard`} variant="ghost">
                Dashboard
              </ButtonLink>
            </div>

            <div className="mt-6 text-sm text-zinc-600">
              Tip: login as <span className="font-semibold">user</span>,{" "}
              <span className="font-semibold">owner</span>, or{" "}
              <span className="font-semibold">admin</span>.
            </div>
          </div>

          <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">Marketplace snapshot</div>
                      <div className="mt-1 text-xs text-zinc-600">
                        Live data from the NestJS backend.
                      </div>
                    </div>
                    <Badge tone="accent">Live preview</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                      <div className="text-xs font-semibold text-zinc-600">Published</div>
                      <div className="mt-2 text-2xl font-semibold text-zinc-900">
                        {stats.total}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                      <div className="text-xs font-semibold text-zinc-600">Price min</div>
                      <div className="mt-2 text-2xl font-semibold text-zinc-900">
                        {minPrice == null ? "—" : formatCurrency(minPrice)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                      <div className="text-xs font-semibold text-zinc-600">Price max</div>
                      <div className="mt-2 text-2xl font-semibold text-zinc-900">
                        {maxPrice == null ? "—" : formatCurrency(maxPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                    <div className="text-xs font-semibold text-zinc-600">Price range</div>
                    <div className="mt-2 text-sm font-semibold text-zinc-900">
                      {minPrice === null || maxPrice === null
                        ? "—"
                        : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`}
                    </div>
                  </div>

                  {featured.length ? (
                    <>
                      <Divider className="my-5" />
                      <div className="text-sm font-semibold text-zinc-900">Featured</div>
                      <div className="mt-3 grid gap-2">
                        {featured.map((p) => (
                          <Link
                            key={p.id}
                            href={`/${t.slug}/properties/${p.id}`}
                            className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
                          >
                            {p.title}
                            <span className="ml-2 text-xs font-semibold text-zinc-500">
                              • {p.location}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4">
                        <ButtonLink href={`/${t.slug}/properties`} variant="secondary">
                          See all listings
                        </ButtonLink>
                      </div>
                    </>
                  ) : (
                    <>
                      <Divider className="my-5" />
                      <div className="text-sm font-semibold text-zinc-900">No published listings yet</div>
                      <div className="mt-2 text-sm text-zinc-600">
                        Login as an owner to create and publish a listing.
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <ButtonLink href={`/${t.slug}/auth/login`}>Login</ButtonLink>
                        <ButtonLink href={`/${t.slug}/dashboard/owner`} variant="secondary">
                          Owner dashboard
                        </ButtonLink>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
        </div>
      </TenantShellMain>
    </TenantShell>
  );
}
