"use client";

import { useEffect } from "react";
import { initFavoritesSync } from "@/lib/favoritesSync";
import { useAuthStore } from "@/store/auth";
import { useFavoritesStore } from "@/store/favorites";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { hydrated, accessToken } = useAuthStore();
  const { syncAllTenantsFromBackend } = useFavoritesStore();

  useEffect(() => {
    const cleanup = initFavoritesSync();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) return;

    // Pull favorites from backend once logged in.
    void syncAllTenantsFromBackend();
  }, [accessToken, hydrated, syncAllTenantsFromBackend]);

  return <>{children}</>;
}
