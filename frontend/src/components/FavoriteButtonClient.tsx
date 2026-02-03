"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { TenantSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";

export function FavoriteButtonClient({
  tenant,
  propertyId,
  className,
}: {
  tenant: TenantSlug;
  propertyId: string;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavoriteOptimistic } = useFavoritesStore();
  const fav = isFavorite(tenant, propertyId);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        onClick={async () => {
          setError(null);
          try {
            await toggleFavoriteOptimistic(tenant, propertyId);
          } catch (e) {
            setError((e as Error).message);
          }
        }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50",
          fav && "border-red-200"
        )}
      >
        <Heart className={cn("h-4 w-4", fav ? "fill-red-500 text-red-500" : "text-zinc-700")} />
        {fav ? "Saved" : "Save"}
      </button>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
