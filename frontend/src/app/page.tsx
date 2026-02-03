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
              A realistic, multi-tenant real-estate UI: browse listings (SSR), open a
              property, save favorites (optimistic + cross-tab sync), and explore
              role-based dashboards (user/owner/admin). Backend wiring comes later via
              NestJS.
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
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                SSR listings
              </span>
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Protected routes
              </span>
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Optimistic favorites
              </span>
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Owner publishing flow
              </span>
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
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Card>
                <CardContent>
                  <div className="text-sm font-semibold text-zinc-900">What this is</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    A frontend-only build that behaves like a real application: routes,
                    dashboards, SSR pages, optimistic UI, and persistence.
                  </p>

                  <Divider className="my-5" />

                  <div className="grid gap-3 text-sm text-zinc-700">
                    <div>
                      <span className="font-semibold text-zinc-900">Multi-tenant:</span> each
                      tenant lives under <span className="font-semibold">/:tenant</span> and
                      has its own branding.
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900">Listings:</span> server-rendered
                      browse page with filters + pagination.
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900">Dashboards:</span> user/owner/admin
                      flows behind protected routes.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent>
                    <div className="text-sm font-semibold text-zinc-900">User</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">
                      Save favorites, see them persist across refresh, and sync across tabs.
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/alpha-homes/dashboard/user" variant="secondary">
                        Open user dashboard
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-sm font-semibold text-zinc-900">Owner</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">
                      Create draft listings, add images, and publish after validation.
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/alpha-homes/dashboard/owner" variant="secondary">
                        Open owner dashboard
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-sm font-semibold text-zinc-900">Admin</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">
                      View all listings, disable any property, and see basic metrics.
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/alpha-homes/dashboard/admin" variant="secondary">
                        Open admin dashboard
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <div className="text-sm font-semibold text-zinc-900">Backend-ready</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-600">
                      A small API seam is already in place so we can swap mock data for NestJS.
                    </div>
                    <div className="mt-4">
                      <ButtonLink href="/alpha-homes/auth/login" variant="secondary">
                        Try login
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <Card className="overflow-hidden">
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="text-sm font-semibold text-zinc-900">How to use it</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-600">
                    Pick a tenant, browse properties, open a detail page, then sign in to preview
                    dashboards. Favorites are persisted locally.
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ButtonLink href="/alpha-homes/properties">Browse</ButtonLink>
                    <ButtonLink href="/alpha-homes/auth/login" variant="secondary">
                      Sign in
                    </ButtonLink>
                    <ButtonLink href="/alpha-homes/dashboard" variant="ghost">
                      Dashboard
                    </ButtonLink>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl border border-zinc-200/70 bg-white/60 p-6">
                    <div className="text-xs font-semibold text-zinc-600">Tech stack</div>
                    <div className="mt-3 grid gap-2 text-sm text-zinc-700">
                      <div><span className="font-semibold text-zinc-900">Next.js</span> (App Router) + SSR pages</div>
                      <div><span className="font-semibold text-zinc-900">TypeScript</span> for safer UI/data models</div>
                      <div><span className="font-semibold text-zinc-900">Tailwind</span> for a consistent design system</div>
                      <div><span className="font-semibold text-zinc-900">Zustand</span> for persisted client state</div>
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
