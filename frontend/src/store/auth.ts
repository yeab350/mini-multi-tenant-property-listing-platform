"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, TenantSlug, User } from "@/lib/types";
import { apiJson } from "@/lib/apiClient";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setSession: (input: { user: User; accessToken: string }) => void;
  loginWithPassword: (input: {
    tenant: TenantSlug;
    email: string;
    password: string;
  }) => Promise<void>;
  registerWithPassword: (input: {
    tenant: TenantSlug;
    email: string;
    password: string;
    role?: Role;
  }) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      loginWithPassword: async ({ tenant, email, password }) => {
        const res = await apiJson<{
          accessToken: string;
          user: { id: string; email: string; role: Role; tenantSlug: TenantSlug };
        }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            tenantSlug: tenant,
            email,
            password,
          }),
        });

        set({
          accessToken: res.accessToken,
          user: {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role,
            tenant: res.user.tenantSlug,
          },
        });
      },
      registerWithPassword: async ({ tenant, email, password, role }) => {
        const res = await apiJson<{
          accessToken: string;
          user: { id: string; email: string; role: Role; tenantSlug: TenantSlug };
        }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            tenantSlug: tenant,
            email,
            password,
            role,
          }),
        });

        set({
          accessToken: res.accessToken,
          user: {
            id: res.user.id,
            email: res.user.email,
            role: res.user.role,
            tenant: res.user.tenantSlug,
          },
        });
      },
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "mtpl_auth_v1",
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
