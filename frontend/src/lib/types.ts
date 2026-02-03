export type Role = "admin" | "owner" | "user";

export type PropertyStatus = "draft" | "published" | "archived";

export type TenantSlug = "alpha-homes" | "city-rentals" | "luxe-estates";

export type Tenant = {
  slug: TenantSlug;
  name: string;
  tagline: string;
  accent: string;
};

export type Property = {
  id: string;
  tenant: TenantSlug;
  ownerId: string | null;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  status: PropertyStatus;
  disabled?: boolean;
};

export type User = {
  id: string;
  email: string;
  role: Role;
  tenant: TenantSlug;
};
