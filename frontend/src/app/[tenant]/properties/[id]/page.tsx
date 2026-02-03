import { notFound } from "next/navigation";
import { getTenant, isTenantSlug } from "@/lib/tenants";
import { getPublicPropertyById } from "@/lib/backendApi";
import { formatCurrency } from "@/lib/format";
import { FavoriteButtonClient } from "@/components/FavoriteButtonClient";
import { ContactOwnerClient } from "@/components/ContactOwnerClient";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";
import Link from "next/link";
import { ApiError } from "@/lib/apiClient";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ tenant: string; id: string }>;
}) {
  const { tenant, id } = await params;
  const t = getTenant(tenant);
  if (!t || !isTenantSlug(tenant)) notFound();

  const property = await getPublicPropertyById(t.slug, id).catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  });
  if (!property) notFound();

  return (
    <TenantShell tenant={t.slug}>
      <TenantShellSidebar>
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-zinc-900">Listing summary</div>
            <div className="mt-2 text-sm font-semibold text-zinc-900 line-clamp-2">
              {property.title}
            </div>
            <div className="mt-1 text-sm text-zinc-600">{property.location}</div>

            <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
              <div className="text-xs font-semibold text-zinc-600">Price</div>
              <div className="mt-2 text-xl font-semibold text-zinc-900">
                {formatCurrency(property.price)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="accent">Published</Badge>
              </div>
            </div>

            <FavoriteButtonClient tenant={t.slug} propertyId={property.id} className="mt-4" />

            <div className="mt-4 grid gap-2">
              <Link
                href={`/${t.slug}/properties`}
                className="rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
              >
                ← Back to listings
              </Link>
            </div>
          </CardContent>
        </Card>
      </TenantShellSidebar>

      <TenantShellMain>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-[16/10]">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
                    }}
                    aria-hidden
                  />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Badge tone="accent">Published</Badge>
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-zinc-800">
                      {property.location}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                  {property.images.slice(0, 4).map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200/60"
                    >
                      <img
                        src={src}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-6">
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                      {property.title}
                    </h1>
                    <div className="mt-2 text-lg font-semibold text-zinc-900">
                      {formatCurrency(property.price)}
                    </div>
                  </div>
                </div>

                <FavoriteButtonClient tenant={t.slug} propertyId={property.id} className="mt-5" />

                <div className="mt-6">
                  <div className="text-sm font-semibold text-zinc-900">About</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{property.description}</p>
                </div>

                <div className="mt-8 rounded-3xl border border-zinc-200/70 bg-white/70 p-5">
                  <div className="text-sm font-semibold text-zinc-900">Contact owner</div>
                  <p className="mt-1 text-sm text-zinc-600">
                    Sends a message request via the NestJS API and shows contact details.
                  </p>
                  <ContactOwnerClient tenant={t.slug} propertyId={property.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TenantShellMain>
    </TenantShell>
  );
}
