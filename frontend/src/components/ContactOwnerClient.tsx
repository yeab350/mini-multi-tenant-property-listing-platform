"use client";

import { useState } from "react";
import type { TenantSlug } from "@/lib/types";
import { contactOwner } from "@/lib/backendApi";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/Button";

export function ContactOwnerClient({
  tenant,
  propertyId,
}: {
  tenant: TenantSlug;
  propertyId: string;
}) {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        type="button"
        className="mt-4 h-11 w-full"
        disabled={loading}
        onClick={async () => {
          setError(null);
          setOwnerEmail(null);

          if (!accessToken) {
            setError("Login required to contact an owner.");
            return;
          }

          setLoading(true);
          try {
            const res = await contactOwner(tenant, accessToken, propertyId);
            setOwnerEmail(res.ownerEmail);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to contact owner.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Sending…" : "Send message"}
      </Button>

      {ownerEmail ? (
        <div className="mt-3 text-sm text-zinc-700">
          Owner email: <span className="font-semibold">{ownerEmail}</span>
        </div>
      ) : null}

      {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}
    </div>
  );
}
