"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role, TenantSlug } from "@/lib/types";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";

export function ProtectedRoute({
  tenant,
  allow,
  children,
}: {
  tenant: TenantSlug;
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace(`/${tenant}/auth/login`);
      return;
    }

    if (user.tenant !== tenant) {
      router.replace(`/${tenant}`);
      return;
    }

    if (!allow.includes(user.role)) {
      router.replace(`/${tenant}/dashboard`);
    }
  }, [allow, hydrated, router, tenant, user]);

  if (!hydrated) {
    return (
      <main>
        <Container className="py-10">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Loading…</div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Container className="py-10">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Redirecting to login…</div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  if (user.tenant !== tenant || !allow.includes(user.role)) {
    return (
      <main>
        <Container className="py-10">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Redirecting…</div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return <>{children}</>;
}
