"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <Container size="full" className="py-16">
        <Card>
          <CardContent>
            <div className="text-sm font-semibold text-zinc-900">Something went wrong</div>
            <div className="mt-2 text-sm text-zinc-600">
              An unexpected error occurred while rendering this page.
            </div>
            <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-4 text-xs text-zinc-600">
              {error.message}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="h-11" onClick={reset}>
                Try again
              </Button>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Go home
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
