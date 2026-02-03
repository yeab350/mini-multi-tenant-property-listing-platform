"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Role, TenantSlug } from "@/lib/types";
import { isTenantSlug } from "@/lib/tenants";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function RegisterPage({
  params,
}: {
  params: { tenant: string };
}) {
  const router = useRouter();
  const tenant = params.tenant;
  const { registerWithPassword } = useAuthStore();

  const validTenant = useMemo(() => isTenantSlug(tenant), [tenant]);
  const tenantSlug = (validTenant ? (tenant as TenantSlug) : null);

  const [email, setEmail] = useState("new@example.com");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState<Role>("user");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!validTenant) {
    return (
      <main>
        <Container className="py-16">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Invalid tenant.</div>
              <Link href="/" className="mt-4 inline-block font-semibold underline">
                Back
              </Link>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <Card className="h-full overflow-hidden">
              <CardContent className="h-full">
                <Badge tone="accent">Create account</Badge>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                  Get started
                </h1>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Create a real account in the NestJS backend for this tenant.
                </p>

                <form
                  className="mt-6 flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);

                    if (!email.trim()) {
                      setError("Email is required.");
                      return;
                    }
                    if (!password.trim()) {
                      setError("Password is required.");
                      return;
                    }

                    if (!tenantSlug) return;

                    setSubmitting(true);
                    registerWithPassword({
                      tenant: tenantSlug,
                      email: email.trim(),
                      password,
                      role,
                    })
                      .then(() => {
                        router.push(`/${tenantSlug}/dashboard`);
                      })
                      .catch((err: unknown) => {
                        const message =
                          err instanceof Error ? err.message : "Registration failed.";
                        setError(message);
                      })
                      .finally(() => setSubmitting(false));
                  }}
                >
                  <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />

                  <Select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    <option value="user">Regular user</option>
                    <option value="owner">Property owner</option>
                    <option value="admin">Admin</option>
                  </Select>

                  {error ? <div className="text-sm text-red-600">{error}</div> : null}

                  <Button type="submit" className="mt-1 h-11" disabled={submitting}>
                    {submitting ? "Creating…" : "Create account"}
                  </Button>
                </form>

                <div className="mt-6 text-sm text-zinc-600">
                  Already have an account?{" "}
                  <Link href={`/${tenant}/auth/login`} className="font-semibold underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="h-full overflow-hidden">
              <CardContent className="h-full">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">What you’ll see next</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                        <div className="text-sm font-semibold text-zinc-900">User</div>
                        <div className="mt-1 text-sm text-zinc-600">Favorites with cross-tab sync.</div>
                      </div>
                      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                        <div className="text-sm font-semibold text-zinc-900">Owner</div>
                        <div className="mt-1 text-sm text-zinc-600">Create drafts, add images, publish.</div>
                      </div>
                      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                        <div className="text-sm font-semibold text-zinc-900">Admin</div>
                        <div className="mt-1 text-sm text-zinc-600">Metrics + disable listings.</div>
                      </div>
                      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4">
                        <div className="text-sm font-semibold text-zinc-900">Multi-tenant</div>
                        <div className="mt-1 text-sm text-zinc-600">Tenant accent theme and routing.</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-zinc-200/70 bg-gradient-to-br from-white to-zinc-50 p-6">
                    <div className="text-sm font-semibold text-zinc-900">Need a different tenant?</div>
                    <div className="mt-1 text-sm text-zinc-600">
                      You can switch tenants any time from the picker.
                    </div>
                    <Link href="/" className="mt-3 inline-block font-semibold underline">
                      Tenant picker
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
