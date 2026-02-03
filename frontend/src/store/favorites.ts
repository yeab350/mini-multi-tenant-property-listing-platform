"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TenantSlug } from "@/lib/types";
import { listFavorites, TENANT_SLUGS, toggleFavorite } from "@/lib/backendApi";
import { useAuthStore } from "@/store/auth";

type FavoritesByTenant = Record<TenantSlug, string[]>;

type FavoritesState = {
  favorites: FavoritesByTenant;
  toggleFavorite: (tenant: TenantSlug, propertyId: string) => void;
  isFavorite: (tenant: TenantSlug, propertyId: string) => boolean;
  toggleFavoriteOptimistic: (tenant: TenantSlug, propertyId: string) => Promise<void>;
  replaceAll: (next: FavoritesByTenant) => void;
  syncTenantFromBackend: (tenant: TenantSlug) => Promise<void>;
  syncAllTenantsFromBackend: () => Promise<void>;
};

const defaultFavorites = (): FavoritesByTenant => ({
  "alpha-homes": [],
  "city-rentals": [],
  "luxe-estates": [],
});

function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: defaultFavorites(),
      replaceAll: (next) => set({ favorites: next }),
      isFavorite: (tenant, propertyId) =>
        (get().favorites[tenant] ?? []).includes(propertyId),
      toggleFavorite: (tenant, propertyId) => {
        set((state) => {
          const current = state.favorites[tenant] ?? [];
          const exists = current.includes(propertyId);
          const next = exists
            ? current.filter((id) => id !== propertyId)
            : [...current, propertyId];

          const updated = { ...state.favorites, [tenant]: next };
          return { favorites: updated };
        });
      },
      toggleFavoriteOptimistic: async (tenant, propertyId) => {
        const before = get().favorites;
        get().toggleFavorite(tenant, propertyId);

        const accessToken = getAccessToken();
        if (!accessToken) {
          // Logged out: keep local-only favorites behavior.
          return;
        }

        try {
          const result = await toggleFavorite(tenant, propertyId, accessToken);
          // Ensure local state matches server truth
          set((state) => {
            const current = state.favorites[tenant] ?? [];
            const exists = current.includes(propertyId);

            if (result.favorited && !exists) {
              return { favorites: { ...state.favorites, [tenant]: [...current, propertyId] } };
            }
            if (!result.favorited && exists) {
              return {
                favorites: {
                  ...state.favorites,
                  [tenant]: current.filter((id) => id !== propertyId),
                },
              };
            }
            return state;
          });
        } catch {
          set({ favorites: before });
          throw new Error("Failed to sync favorite. Reverted.");
        }
      },
      syncTenantFromBackend: async (tenant) => {
        const accessToken = getAccessToken();
        if (!accessToken) return;

        const ids = await listFavorites(tenant, accessToken);
        set((state) => ({ favorites: { ...state.favorites, [tenant]: ids } }));
      },
      syncAllTenantsFromBackend: async () => {
        const accessToken = getAccessToken();
        if (!accessToken) return;

        const results = await Promise.all(
          TENANT_SLUGS.map(async (tenant) => [tenant, await listFavorites(tenant, accessToken)] as const)
        );
        set((state) => {
          const next = { ...state.favorites };
          for (const [tenant, ids] of results) {
            next[tenant] = ids;
          }
          return { favorites: next };
        });
      },
    }),
    {
      name: "mtpl_favorites_v1",
      partialize: (state) => ({ favorites: state.favorites }),
      version: 1,
    }
  )
);
