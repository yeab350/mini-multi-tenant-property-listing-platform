import Link from "next/link";
import { notFound } from "next/navigation";
import { getTenant, isTenantSlug } from "@/lib/tenants";
import { listPublicProperties } from "@/lib/backendApi";
import { PropertyCardClient } from "@/components/PropertyCardClient";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

function parseNumber(value: unknown) {
  if (typeof value !== "string") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tenant } = await params;
  const t = getTenant(tenant);
  if (!t || !isTenantSlug(tenant)) notFound();

  const sp = await searchParams;
  const location = typeof sp.location === "string" ? sp.location : "";
  const minPrice = parseNumber(sp.minPrice);
  const maxPrice = parseNumber(sp.maxPrice);
  const page = parseNumber(sp.page) ?? 1;

  const result = await listPublicProperties(t.slug, {
    location,
    minPrice,
    maxPrice,
    page,
    pageSize: 6,
  });

  return (
    <TenantShell tenant={t.slug}>
      <TenantShellSidebar>
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-zinc-900">Filters</div>
            <div className="mt-1 text-sm text-zinc-600">Refine your search.</div>

            <form className="mt-5 flex flex-col gap-4">
              <Input
                name="location"
                label="Location"
                defaultValue={location}
                placeholder="e.g. Austin"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  name="minPrice"
                  label="Min price"
                  inputMode="numeric"
                  defaultValue={minPrice ?? ""}
                  placeholder="0"
                />
                <Input
                  name="maxPrice"
                  label="Max price"
                  inputMode="numeric"
                  defaultValue={maxPrice ?? ""}
                  placeholder="1000000"
                />
              </div>

              <Button type="submit" className="h-11">
                Apply filters
              </Button>

              <div className="text-xs text-zinc-500">
                Only <span className="font-semibold">published</span> properties are shown.
              </div>
            </form>
          </CardContent>
        </Card>
      </TenantShellSidebar>

      <TenantShellMain>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Browse properties
            </h1>
            <Badge tone="accent">SSR</Badge>
          </div>
          <p className="text-sm text-zinc-600">
            Filter by location and price. Save favorites with instant UI updates.
          </p>
        </div>

        <div className="mt-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((p) => (
              <PropertyCardClient key={p.id} tenant={t.slug} property={p} />
            ))}
          </div>

          {result.total === 0 ? (
            <Card className="mt-6">
              <CardContent>
                <div className="text-sm font-semibold text-zinc-900">No results</div>
                <div className="mt-2 text-sm text-zinc-600">
                  Try clearing filters or changing the location.
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-zinc-200/70 bg-white/60 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-600">
              Page <span className="font-semibold">{result.page}</span> of{" "}
              <span className="font-semibold">{result.totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              {result.page > 1 ? (
                <Link
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  href={{
                    pathname: `/${tenant}/properties`,
                    query: {
                      ...(location ? { location } : {}),
                      ...(minPrice !== undefined ? { minPrice: String(minPrice) } : {}),
                      ...(maxPrice !== undefined ? { maxPrice: String(maxPrice) } : {}),
                      page: String(result.page - 1),
                    },
                  }}
                >
                  Previous
                </Link>
              ) : null}
              {result.page < result.totalPages ? (
                <Link
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  href={{
                    pathname: `/${tenant}/properties`,
                    query: {
                      ...(location ? { location } : {}),
                      ...(minPrice !== undefined ? { minPrice: String(minPrice) } : {}),
                      ...(maxPrice !== undefined ? { maxPrice: String(maxPrice) } : {}),
                      page: String(result.page + 1),
                    },
                  }}
                >
                  Next
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </TenantShellMain>
    </TenantShell>
  );
}
