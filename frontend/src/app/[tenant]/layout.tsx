import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTenant } from "@/lib/tenants";
import { ClientProviders } from "@/components/ClientProviders";
import { Navbar } from "@/components/Navbar";

export function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  return params.then(({ tenant }) => {
    const t = getTenant(tenant);
    if (!t) return { title: "Tenant Not Found" };
    return {
      title: `${t.name} • Property Portal`,
      description: t.tagline,
    };
  });
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const t = getTenant(tenant);
  if (!t) notFound();

  const style = { "--tenant-accent": t.accent } as React.CSSProperties;

  return (
    <ClientProviders>
      <div style={style}>
        <Navbar tenant={t} />
        {children}
      </div>
    </ClientProviders>
  );
}
