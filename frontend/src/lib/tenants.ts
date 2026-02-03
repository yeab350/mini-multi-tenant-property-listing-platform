import { Tenant, TenantSlug } from "@/lib/types";

export const TENANTS: Tenant[] = [
  {
    slug: "alpha-homes",
    name: "Alpha Homes",
    tagline: "Family-friendly homes and condos",
    accent: "#4F46E5",
  },
  {
    slug: "city-rentals",
    name: "City Rentals",
    tagline: "Apartments in the heart of downtown",
    accent: "#0EA5E9",
  },
  {
    slug: "luxe-estates",
    name: "Luxe Estates",
    tagline: "Premium listings with curated photos",
    accent: "#D97706",
  },
];

export function getTenant(slug: string): Tenant | null {
  const tenant = TENANTS.find((t) => t.slug === slug);
  return tenant ?? null;
}

export function isTenantSlug(slug: string): slug is TenantSlug {
  return TENANTS.some((t) => t.slug === slug);
}
