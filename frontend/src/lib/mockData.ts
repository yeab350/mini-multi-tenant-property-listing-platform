import { Property, TenantSlug } from "@/lib/types";

const UNSPLASH = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=80`;

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "ah-101",
    tenant: "alpha-homes",
    ownerId: "owner-1",
    title: "Sunny 3BR in Quiet Neighborhood",
    description:
      "Bright living spaces, updated kitchen, and a fenced backyard. Great schools nearby.",
    location: "Austin, TX",
    price: 425000,
    images: [UNSPLASH("photo-1507089947368-19c1da9775ae"), UNSPLASH("photo-1568605114967-8130f3a36994")],
    status: "published",
  },
  {
    id: "ah-102",
    tenant: "alpha-homes",
    ownerId: "owner-1",
    title: "Modern Condo with Pool Access",
    description:
      "Open-concept condo with balcony views and community pool. Walkable to parks.",
    location: "Austin, TX",
    price: 315000,
    images: [UNSPLASH("photo-1505693416388-ac5ce068fe85"), UNSPLASH("photo-1502672023488-70e25813eb80")],
    status: "draft",
  },
  {
    id: "cr-201",
    tenant: "city-rentals",
    ownerId: "owner-2",
    title: "Downtown Studio Near Transit",
    description:
      "Compact studio with natural light, steps away from metro and cafés.",
    location: "Chicago, IL",
    price: 1800,
    images: [UNSPLASH("photo-1502005229762-cf1b2da7c5d6"), UNSPLASH("photo-1522708323590-d24dbb6b0267")],
    status: "published",
  },
  {
    id: "cr-202",
    tenant: "city-rentals",
    ownerId: "owner-2",
    title: "2BR Apartment with Skyline View",
    description:
      "Spacious 2BR with skyline balcony, in-building gym, and secure parking.",
    location: "Chicago, IL",
    price: 3200,
    images: [UNSPLASH("photo-1501183638710-841dd1904471"), UNSPLASH("photo-1523217582562-09d0def993a6")],
    status: "published",
  },
  {
    id: "le-301",
    tenant: "luxe-estates",
    ownerId: "owner-3",
    title: "Hillside Villa with Infinity Pool",
    description:
      "A private villa with panoramic views, infinity pool, and designer finishes.",
    location: "Los Angeles, CA",
    price: 3250000,
    images: [UNSPLASH("photo-1505691938895-1758d7feb511"), UNSPLASH("photo-1494526585095-c41746248156")],
    status: "published",
  },
];

export type PropertyFilters = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};

export function getPublicProperties(tenant: TenantSlug, filters: PropertyFilters) {
  const pageSize = filters.pageSize ?? 6;
  const page = Math.max(1, filters.page ?? 1);

  const normalizedLocation = (filters.location ?? "").trim().toLowerCase();

  const all = MOCK_PROPERTIES.filter((p) => p.tenant === tenant);
  const published = all.filter((p) => p.status === "published" && !p.disabled);

  const filtered = published.filter((p) => {
    if (normalizedLocation && !p.location.toLowerCase().includes(normalizedLocation)) {
      return false;
    }
    if (typeof filters.minPrice === "number" && p.price < filters.minPrice) {
      return false;
    }
    if (typeof filters.maxPrice === "number" && p.price > filters.maxPrice) {
      return false;
    }
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const start = (clampedPage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, page: clampedPage, totalPages };
}

export function getPropertyById(tenant: TenantSlug, id: string) {
  const property = MOCK_PROPERTIES.find((p) => p.tenant === tenant && p.id === id);
  return property ?? null;
}

export function getAllPropertiesForTenant(tenant: TenantSlug) {
  return MOCK_PROPERTIES.filter((p) => p.tenant === tenant);
}
