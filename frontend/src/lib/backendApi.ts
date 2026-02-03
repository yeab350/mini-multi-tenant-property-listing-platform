import { apiJson } from "@/lib/apiClient";
import type { Property, TenantSlug } from "@/lib/types";

export const TENANT_SLUGS = ["alpha-homes", "city-rentals", "luxe-estates"] as const;

type ApiProperty = {
  id: string;
  tenantId: string;
  ownerId: string | null;
  title: string;
  description: string;
  location: string;
  price: number;
  status: "draft" | "published" | "archived";
  disabled: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export function mapApiProperty(tenant: TenantSlug, p: ApiProperty): Property {
  return {
    id: p.id,
    tenant,
    ownerId: p.ownerId,
    title: p.title,
    description: p.description,
    location: p.location,
    price: Number(p.price),
    images: Array.isArray(p.images) ? p.images : [],
    status: p.status,
    disabled: p.disabled,
  };
}

export type PublicPropertyFilters = {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};

export async function listPublicProperties(
  tenant: TenantSlug,
  filters: PublicPropertyFilters
): Promise<{ items: Property[]; total: number; page: number; totalPages: number }> {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location);
  if (typeof filters.minPrice === "number") params.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number") params.set("maxPrice", String(filters.maxPrice));
  if (typeof filters.page === "number") params.set("page", String(filters.page));
  if (typeof filters.pageSize === "number") params.set("pageSize", String(filters.pageSize));

  const qs = params.toString();
  const res = await apiJson<{
    items: ApiProperty[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/tenants/${tenant}/public/properties${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });

  return {
    items: (res.items ?? []).map((p) => mapApiProperty(tenant, p)),
    total: res.total,
    page: res.page,
    totalPages: res.totalPages,
  };
}

export async function getPublicPropertyById(
  tenant: TenantSlug,
  id: string
): Promise<Property> {
  const res = await apiJson<ApiProperty>(
    `/tenants/${tenant}/public/properties/${id}`,
    { cache: "no-store" }
  );
  return mapApiProperty(tenant, res);
}

export async function getPublicPropertyStats(
  tenant: TenantSlug,
  filters?: Omit<PublicPropertyFilters, "page" | "pageSize">
): Promise<{ total: number; minPrice: number | null; maxPrice: number | null }> {
  const params = new URLSearchParams();
  if (filters?.location) params.set("location", filters.location);
  if (typeof filters?.minPrice === "number") params.set("minPrice", String(filters.minPrice));
  if (typeof filters?.maxPrice === "number") params.set("maxPrice", String(filters.maxPrice));

  const qs = params.toString();
  return apiJson<{ total: number; minPrice: number | null; maxPrice: number | null }>(
    `/tenants/${tenant}/public/properties/stats${qs ? `?${qs}` : ""}`,
    { cache: "no-store" }
  );
}

export async function listFavorites(
  tenant: TenantSlug,
  accessToken: string
): Promise<string[]> {
  const res = await apiJson<{ propertyIds: string[] }>(
    `/tenants/${tenant}/favorites`,
    {
      method: "GET",
      accessToken,
      cache: "no-store",
    }
  );
  return res.propertyIds ?? [];
}

export async function toggleFavorite(
  tenant: TenantSlug,
  propertyId: string,
  accessToken: string
): Promise<{ favorited: boolean }> {
  return apiJson<{ favorited: boolean }>(
    `/tenants/${tenant}/favorites/${propertyId}/toggle`,
    {
      method: "POST",
      accessToken,
    }
  );
}

export async function listOwnerProperties(
  tenant: TenantSlug,
  accessToken: string
): Promise<Property[]> {
  const res = await apiJson<ApiProperty[]>(`/tenants/${tenant}/owner/properties`, {
    method: "GET",
    accessToken,
    cache: "no-store",
  });
  return (res ?? []).map((p) => mapApiProperty(tenant, p));
}

export async function createDraftProperty(
  tenant: TenantSlug,
  accessToken: string,
  input: {
    title: string;
    description: string;
    location: string;
    price: number;
    images?: string[];
  }
): Promise<Property> {
  const res = await apiJson<ApiProperty>(`/tenants/${tenant}/owner/properties`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
  return mapApiProperty(tenant, res);
}

export async function updateDraftProperty(
  tenant: TenantSlug,
  accessToken: string,
  id: string,
  input: Partial<{
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
  }>
): Promise<Property> {
  const res = await apiJson<ApiProperty>(`/tenants/${tenant}/owner/properties/${id}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
  return mapApiProperty(tenant, res);
}

export async function publishProperty(
  tenant: TenantSlug,
  accessToken: string,
  id: string
): Promise<Property> {
  const res = await apiJson<ApiProperty>(`/tenants/${tenant}/owner/properties/${id}/publish`, {
    method: "POST",
    accessToken,
    body: JSON.stringify({ force: false }),
  });
  return mapApiProperty(tenant, res);
}

export async function archiveProperty(
  tenant: TenantSlug,
  accessToken: string,
  id: string
): Promise<Property> {
  const res = await apiJson<ApiProperty>(`/tenants/${tenant}/owner/properties/${id}/archive`, {
    method: "POST",
    accessToken,
  });
  return mapApiProperty(tenant, res);
}

export async function deleteProperty(
  tenant: TenantSlug,
  accessToken: string,
  id: string
): Promise<{ deleted: true }> {
  return apiJson<{ deleted: true }>(`/tenants/${tenant}/owner/properties/${id}/delete`, {
    method: "POST",
    accessToken,
  });
}

export async function uploadOwnerImages(
  tenant: TenantSlug,
  accessToken: string,
  files: File[]
): Promise<string[]> {
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }

  const res = await apiJson<{ urls: string[] }>(`/tenants/${tenant}/owner/uploads/images`, {
    method: "POST",
    accessToken,
    body: form,
  });

  return res.urls ?? [];
}

export async function contactOwner(
  tenant: TenantSlug,
  accessToken: string,
  propertyId: string
): Promise<{ ownerEmail: string }> {
  return apiJson<{ ownerEmail: string }>(
    `/tenants/${tenant}/public/properties/${propertyId}/contact`,
    {
      method: "POST",
      accessToken,
    }
  );
}

export async function getAdminMetrics(
  tenant: TenantSlug,
  accessToken: string
): Promise<{
  tenant: { id: string; slug: string; name: string };
  properties: {
    total: number;
    deleted: number;
    draft: number;
    published: number;
    archived: number;
    disabled: number;
  };
  users: { total: number };
  favorites: { total: number };
}> {
  return apiJson(
    `/tenants/${tenant}/admin/metrics`,
    {
      method: "GET",
      accessToken,
      cache: "no-store",
    }
  );
}

export async function listAdminProperties(
  tenant: TenantSlug,
  accessToken: string
): Promise<Property[]> {
  const res = await apiJson<ApiProperty[]>(`/tenants/${tenant}/admin/properties`, {
    method: "GET",
    accessToken,
    cache: "no-store",
  });
  return (res ?? []).map((p) => mapApiProperty(tenant, p));
}

export async function toggleDisabledProperty(
  tenant: TenantSlug,
  accessToken: string,
  id: string
): Promise<Property> {
  const res = await apiJson<ApiProperty>(
    `/tenants/${tenant}/admin/properties/${id}/toggle-disabled`,
    {
      method: "PATCH",
      accessToken,
    }
  );
  return mapApiProperty(tenant, res);
}
