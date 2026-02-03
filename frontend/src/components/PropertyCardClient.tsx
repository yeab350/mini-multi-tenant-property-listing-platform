"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Property, TenantSlug } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites";
import { useState } from "react";

export function PropertyCardClient({
  tenant,
  property,
}: {
  tenant: TenantSlug;
  property: Property;
}) {
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavoriteOptimistic } = useFavoritesStore();

  const fav = isFavorite(tenant, property.id);

  return (
    <div className="group overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10]">
        <img
          src={property.images[0]}
          alt={property.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        <button
          type="button"
          onClick={async () => {
            setError(null);
            try {
              await toggleFavoriteOptimistic(tenant, property.id);
            } catch (e) {
              setError((e as Error).message);
            }
          }}
          className={cn(
            "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur transition hover:bg-white",
            fav && "border-red-200"
          )}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={cn("h-5 w-5", fav ? "fill-red-500 text-red-500" : "text-zinc-700")} />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/${tenant}/properties/${property.id}`}
            className="text-base font-semibold leading-6 text-zinc-900"
          >
            {property.title}
          </Link>
          <div className="text-sm font-semibold text-zinc-900">
            {formatCurrency(property.price)}
          </div>
        </div>
        <div className="text-sm text-zinc-600">{property.location}</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-2 py-1 font-medium">
            Published
          </span>
          <span>•</span>
          <span>View details →</span>
        </div>
        {error ? <div className="text-xs text-red-600">{error}</div> : null}
      </div>
    </div>
  );
}
