import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/20 bg-white/25 backdrop-blur supports-[backdrop-filter]:bg-white/20">
      <Container size="full" className="py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-sm font-semibold text-zinc-900">
              Mini Multi-Tenant Property Listing
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              Frontend-only demo using Next.js App Router. Data is mocked in-memory and
              stored locally until the NestJS backend is added.
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="text-xs font-semibold text-zinc-900">Product</div>
                <div className="mt-3 grid gap-2 text-sm">
                  <Link href="/" className="text-zinc-600 hover:text-zinc-900">
                    Tenant picker
                  </Link>
                  <Link href="/alpha-homes" className="text-zinc-600 hover:text-zinc-900">
                    Open demo tenant
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-900">Features</div>
                <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                  <div>SSR listings + filters</div>
                  <div>Protected dashboards</div>
                  <div>Optimistic favorites</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-900">Tech</div>
                <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                  <div>Next.js + TypeScript</div>
                  <div>Tailwind</div>
                  <div>Zustand (persist)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Demo UI</div>
          <div className="text-zinc-500">Built for the practical exam (frontend only)</div>
        </div>
      </Container>
    </footer>
  );
}
