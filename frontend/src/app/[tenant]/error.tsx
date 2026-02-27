"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { TenantSlug } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TenantError({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { tenant: TenantSlug };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const base = `/${params.tenant}`;

  return (
    <main>
      <Container size="full" className="py-16">
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-zinc-900">Tenant page error</div>
            <div className="mt-2 text-sm text-zinc-600">
              Something went wrong while loading this tenant.
            </div>
            <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-4 text-xs text-zinc-600">
              {error.message}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="h-11" onClick={reset}>
                Try again
              </Button>
              <Link
                href={base}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Tenant home
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Tenant picker
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
