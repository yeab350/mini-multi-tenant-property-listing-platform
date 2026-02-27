import type { MetadataRoute } from "next";
import { TENANTS } from "@/lib/tenants";

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && /^https?:\/\//.test(envUrl)) return envUrl.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const baseRoutes: string[] = ["/"];

  const tenantRoutes = TENANTS.flatMap((t) => {
    const base = `/${t.slug}`;
    return [
      base,
      `${base}/properties`,
      `${base}/dashboard`,
      `${base}/dashboard/user`,
      `${base}/dashboard/owner`,
      `${base}/dashboard/admin`,
      `${base}/auth/login`,
      `${base}/auth/register`,
    ];
  });

  const all = [...baseRoutes, ...tenantRoutes];

  return all.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "daily",
    priority: path === "/" ? 1 : 0.7,
  }));
}
