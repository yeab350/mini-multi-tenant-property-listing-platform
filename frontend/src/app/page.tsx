import Link from "next/link";
import { TENANTS } from "@/lib/tenants";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SiteHeader } from "@/components/SiteHeader";
import { HomeHeroBackground } from "@/components/HomeHeroBackground";
import { Divider } from "@/components/ui/Divider";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  const highlightChips = [
    "SSR listings",
    "Protected dashboards",
    "Optimistic favorites",
    "Owner publishing",
  ];

  const roleCards = [
    {
      title: "User",
      body: "Save favorites and see them persist + sync across tabs.",
      href: "/alpha-homes/dashboard/user",
    },
    {
      title: "Owner",
      body: "Create drafts, upload images, and publish after validation.",
      href: "/alpha-homes/dashboard/owner",
    },
    {
      title: "Admin",
      body: "Moderate listings and view basic platform metrics.",
      href: "/alpha-homes/dashboard/admin",
    },
  ];

  return (
    <div className="min-h-screen relative">
      <HomeHeroBackground />
      <SiteHeader />
      <main>
        <Container size="full" className="py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Badge tone="accent">Frontend Demo • Next.js</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Mini Multi-Tenant
              <span className="block text-zinc-700">Property Listing Platform</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Pick a tenant, browse SSR listings, save favorites, and preview
              role-based dashboards.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <ButtonLink href="/alpha-homes" className="h-11">
                Open demo tenant
              </ButtonLink>
              <ButtonLink href="/alpha-homes/properties" variant="secondary" className="h-11">
                Browse listings
              </ButtonLink>
              <ButtonLink href="#how" variant="ghost" className="h-11">
                How it works
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-sm text-zinc-600">
              {highlightChips.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div id="tenants" className="lg:col-span-5 lg:justify-self-end w-full max-w-xl">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-white to-zinc-50 p-6">
                  <div className="text-sm font-semibold text-zinc-900">Pick a tenant</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    Each tenant uses an accent color + isolated routes.
                  </div>
                </div>
                <div className="grid gap-3 p-6">
                  {TENANTS.map((tenant) => (
                    <Link
                      key={tenant.slug}
                      href={`/${tenant.slug}`}
                      className="group rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-base font-semibold text-zinc-900">
                            {tenant.name}
                          </div>
                          <div className="mt-1 text-sm text-zinc-600">
                            {tenant.tagline}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: tenant.accent }}
                            aria-hidden
                          />
                          <span className="text-xs font-medium text-zinc-500">Enter</span>
                        </div>
                      </div>
                      <div className="mt-3 h-px bg-zinc-200/60" />
                      <div className="mt-3 text-xs text-zinc-500 group-hover:text-zinc-700">
                        Open tenant portal →
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section id="how" className="mt-14">
          <Card>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-5">
                  <div className="text-sm font-semibold text-zinc-900">How it works</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    The app is multi-tenant by URL (<span className="font-semibold">/:tenant</span>),
                    with SSR listing pages and protected dashboards.
                  </p>

                  <Divider className="my-5" />

                  <div className="grid gap-3 text-sm text-zinc-700">
                    <div>
                      <span className="font-semibold text-zinc-900">1.</span> Pick a tenant.
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900">2.</span> Browse properties (SSR).
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900">3.</span> Sign in to preview roles.
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ButtonLink href="/alpha-homes/properties">Browse</ButtonLink>
                    <ButtonLink href="/alpha-homes/auth/login" variant="secondary">
                      Sign in
                    </ButtonLink>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {roleCards.map((card) => (
                      <Card key={card.title} className="bg-white/50">
                        <CardContent>
                          <div className="text-sm font-semibold text-zinc-900">{card.title}</div>
                          <div className="mt-2 text-sm leading-6 text-zinc-600">{card.body}</div>
                          <div className="mt-4">
                            <ButtonLink href={card.href} variant="secondary">
                              Open
                            </ButtonLink>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-4 rounded-3xl border border-zinc-200/70 bg-white/60 p-5">
                    <div className="text-xs font-semibold text-zinc-600">Tech stack</div>
                    <div className="mt-2 text-sm text-zinc-700">
                      Next.js + TypeScript + Tailwind + Zustand.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        </Container>
      </main>
    </div>
  );
}
