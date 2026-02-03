"use client";

import { useFavoritesStore } from "@/store/favorites";
import type { TenantSlug } from "@/lib/types";

const STORAGE_KEY = "mtpl_favorites_v1";
const CHANNEL_NAME = "mtpl_favorites_channel";

type PersistShape = {
  state?: {
    favorites?: Record<TenantSlug, string[]>;
  };
};

export function initFavoritesSync() {
  if (typeof window === "undefined") return;

  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  const applyFromStorage = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: PersistShape = JSON.parse(raw);
      const favorites = parsed?.state?.favorites;
      if (favorites) {
        useFavoritesStore.getState().replaceAll(favorites);
      }
    } catch {
      // ignore
    }
  };

  // Cross-tab via storage events
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    applyFromStorage();
  };
  window.addEventListener("storage", onStorage);

  // Cross-tab via broadcast channel (faster than waiting for storage)
  channel?.addEventListener("message", () => {
    applyFromStorage();
  });

  // Broadcast on local changes
  const unsubscribe = useFavoritesStore.subscribe(() => {
    channel?.postMessage({ type: "favorites_updated" });
  });

  // Initial pull
  applyFromStorage();

  return () => {
    window.removeEventListener("storage", onStorage);
    unsubscribe();
    channel?.close();
  };
}
