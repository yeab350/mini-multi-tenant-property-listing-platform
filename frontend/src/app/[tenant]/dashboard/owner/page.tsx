"use client";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { formatCurrency } from "@/lib/format";
import { isTenantSlug } from "@/lib/tenants";
import type { Property, PropertyStatus, TenantSlug } from "@/lib/types";
import { validateImageFile } from "@/lib/imageValidation";
import {
  archiveProperty,
  createDraftProperty,
  deleteProperty,
  listOwnerProperties,
  publishProperty,
  uploadOwnerImages,
  updateDraftProperty,
} from "@/lib/backendApi";
import { useAuthStore } from "@/store/auth";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { TenantShell, TenantShellMain, TenantShellSidebar } from "@/components/TenantShell";

function canPublish(p: Property) {
  return (
    p.title.trim().length >= 5 &&
    p.description.trim().length >= 20 &&
    p.location.trim().length >= 3 &&
    Number.isFinite(p.price) &&
    p.price > 0 &&
    Array.isArray(p.images) &&
    p.images.length >= 1
  );
}

export default function OwnerDashboard({ params }: { params: { tenant: string } }) {
  const tenant = params.tenant;
  const validTenant = useMemo(() => isTenantSlug(tenant), [tenant]);
  const tenantSlug = useMemo(
    () => (validTenant ? (tenant as TenantSlug) : null),
    [tenant, validTenant]
  );

  const { accessToken } = useAuthStore();

  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    imageUrl: "",
    images: [] as string[],
    description: "",
  });
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!tenantSlug) return;
    if (!accessToken) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      setLoadError(null);
    });

    listOwnerProperties(tenantSlug, accessToken)
      .then((items) => {
        if (cancelled) return;
        setRows(items);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load properties.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, tenantSlug]);

  if (!tenantSlug) {
    return (
      <main>
        <Container className="py-16">
          <Card>
            <CardContent>
              <div className="text-sm text-zinc-600">Invalid tenant.</div>
            </CardContent>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <ProtectedRoute tenant={tenantSlug} allow={["owner"]}>
      <TenantShell tenant={tenantSlug}>
        <TenantShellSidebar>
          <Card>
            <CardContent>
              <div className="text-sm font-semibold text-zinc-900">Owner tools</div>
              <div className="mt-1 text-sm text-zinc-600">
                Draft, validate, then publish.
              </div>
              <div className="mt-4 grid gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Jump to create form
                </Button>
              </div>
              <div className="mt-4 text-xs text-zinc-600">
                Publishing requires: title (5+), description (20+), location (3+), price &gt; 0, and 1+ image.
              </div>
            </CardContent>
          </Card>
        </TenantShellSidebar>

        <TenantShellMain>
          <div className="flex items-center gap-2">
            <Badge tone="accent">Owner</Badge>
            <span className="text-xs font-semibold text-zinc-500">Drafts & publishing</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Manage your listings
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Create draft properties, edit drafts, and publish after validation.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="text-sm font-semibold text-zinc-900">Create draft</div>
                  <div className="mt-1 text-xs text-zinc-600">
                    Image upload will be wired to cloud storage in the NestJS backend.
                  </div>
                </CardHeader>
                <CardContent>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setImageError(null);

                      if (!accessToken) {
                        setImageError("You must be logged in.");
                        return;
                      }

                      const price = Number(form.price);
                      const images = form.images.length
                        ? form.images
                        : form.imageUrl
                          ? [form.imageUrl]
                          : [];

                      void createDraftProperty(tenantSlug, accessToken, {
                        title: form.title,
                        description: form.description,
                        location: form.location,
                        price: Number.isFinite(price) ? price : 0,
                        images,
                      })
                        .then((created) => {
                          setRows((current) => [created, ...current]);
                          setForm({
                            title: "",
                            location: "",
                            price: "",
                            imageUrl: "",
                            images: [],
                            description: "",
                          });
                        })
                        .catch((err: unknown) => {
                          setImageError(
                            err instanceof Error ? err.message : "Failed to create draft."
                          );
                        });
                    }}
                  >
                    <Input
                      label="Title"
                      value={form.title}
                      onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                      placeholder="Modern 2BR apartment with city views"
                    />
                    <Input
                      label="Location"
                      value={form.location}
                      onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                      placeholder="Addis Ababa, Bole"
                    />
                    <Input
                      label="Price"
                      value={form.price}
                      onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                      placeholder="2500000"
                      inputMode="numeric"
                    />

                    <div className="grid gap-2">
                      <Input
                        label="Image URL (optional)"
                        value={form.imageUrl}
                        onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setImageError(null);
                          const url = form.imageUrl.trim();
                          if (!url) return;
                          setForm((s) => ({
                            ...s,
                            images: s.images.includes(url) ? s.images : [...s.images, url],
                            imageUrl: "",
                          }));
                        }}
                      >
                        Add image URL
                      </Button>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-zinc-700">
                        Upload images
                        <span className="ml-2 text-xs font-normal text-zinc-500">
                          (JPG/PNG/WebP, max 5MB each)
                        </span>
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={(e) => {
                          setImageError(null);
                          const files = Array.from(e.target.files ?? []);
                          if (files.length === 0) return;

                          if (!accessToken) {
                            setImageError("You must be logged in to upload images.");
                            e.currentTarget.value = "";
                            return;
                          }

                          const okFiles: File[] = [];
                          for (const file of files) {
                            const validation = validateImageFile(file);
                            if (!validation.ok) {
                              setImageError(validation.error);
                              continue;
                            }
                            okFiles.push(file);
                          }

                          if (okFiles.length) {
                            setUploading(true);
                            void uploadOwnerImages(tenantSlug, accessToken, okFiles)
                              .then((urls) => {
                                if (!urls.length) return;
                                setForm((s) => ({
                                  ...s,
                                  images: [...s.images, ...urls.filter((u) => !s.images.includes(u))],
                                }));
                              })
                              .catch((err: unknown) => {
                                setImageError(
                                  err instanceof Error
                                    ? err.message
                                    : "Failed to upload images."
                                );
                              })
                              .finally(() => setUploading(false));
                          }

                          // allow picking the same file again
                          e.currentTarget.value = "";
                        }}
                        className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-2xl file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200"
                      />
                    </label>

                    {uploading ? (
                      <div className="text-sm text-zinc-600">Uploading…</div>
                    ) : null}

                    {imageError ? (
                      <div className="text-sm text-red-600">{imageError}</div>
                    ) : null}

                    {form.images.length ? (
                      <div className="rounded-3xl border border-zinc-200/70 bg-white/60 p-4">
                        <div className="text-xs font-semibold text-zinc-700">Selected images</div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {form.images.map((src) => (
                            <div key={src} className="group relative overflow-hidden rounded-2xl">
                              <img src={src} alt="" className="h-24 w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setForm((s) => ({
                                    ...s,
                                    images: s.images.filter((u) => u !== src),
                                  }));
                                }}
                                className="absolute right-2 top-2 rounded-xl bg-white/90 px-2 py-1 text-xs font-semibold text-zinc-900 opacity-0 shadow-sm transition group-hover:opacity-100"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <Textarea
                      label="Description"
                      value={form.description}
                      onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                      placeholder="Add details (min ~20 chars required to publish)"
                    />

                    <Button type="submit" className="h-11">
                      Create draft
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="text-sm font-semibold text-zinc-900">Your properties</div>
                  <div className="mt-1 text-xs text-zinc-600">
                    Drafts can be edited and published.
                  </div>
                </CardHeader>

                {loading ? (
                  <div className="px-6 py-4 text-sm text-zinc-600">Loading…</div>
                ) : null}
                {loadError ? (
                  <div className="px-6 py-4 text-sm text-red-600">{loadError}</div>
                ) : null}

                <div className="divide-y divide-zinc-100">
                  {rows.map((p) => {
                    const editable = p.status === "draft";
                    const valid = canPublish(p);

                    return (
                      <div key={p.id} className="p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-sm font-semibold text-zinc-900">{p.title}</div>
                            <div className="mt-1 text-xs text-zinc-600">
                              {p.location} • {formatCurrency(p.price)}
                            </div>
                            <div className="mt-2">
                              <Badge tone="neutral">{p.status}</Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              disabled={!editable}
                              onClick={() => {
                                const nextTitle = window.prompt("Edit title", p.title);
                                if (nextTitle === null) return;

                                if (!accessToken) return;
                                void updateDraftProperty(tenantSlug, accessToken, p.id, {
                                  title: nextTitle,
                                })
                                  .then((updated) => {
                                    setRows((current) =>
                                      current.map((row) => (row.id === p.id ? updated : row))
                                    );
                                  })
                                  .catch(() => {
                                    // keep UX simple; ignore
                                  });
                              }}
                            >
                              Edit draft
                            </Button>

                            <Button
                              type="button"
                              disabled={!editable || !valid}
                              onClick={async () => {
                                if (!accessToken) return;
                                const before = rows;
                                setRows((current) =>
                                  current.map((row) =>
                                    row.id === p.id
                                      ? { ...row, status: "published" as PropertyStatus }
                                      : row
                                  )
                                );

                                try {
                                  const updated = await publishProperty(tenantSlug, accessToken, p.id);
                                  setRows((current) =>
                                    current.map((row) => (row.id === p.id ? updated : row))
                                  );
                                } catch {
                                  setRows(before);
                                }
                              }}
                            >
                              Publish
                            </Button>

                            <Button
                              type="button"
                              variant="secondary"
                              disabled={p.status === "published"}
                              onClick={() => {
                                if (!accessToken) return;
                                void archiveProperty(tenantSlug, accessToken, p.id)
                                  .then((updated) => {
                                    setRows((current) =>
                                      current.map((row) => (row.id === p.id ? updated : row))
                                    );
                                  })
                                  .catch(() => {
                                    // keep UX simple
                                  });
                              }}
                            >
                              Archive
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              disabled={p.status === "published"}
                              onClick={() => {
                                if (!accessToken) return;
                                const ok = window.confirm(
                                  "Soft-delete this property? (Draft/archived only)"
                                );
                                if (!ok) return;

                                void deleteProperty(tenantSlug, accessToken, p.id)
                                  .then(() => {
                                    setRows((current) => current.filter((row) => row.id !== p.id));
                                  })
                                  .catch(() => {
                                    // ignore
                                  });
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {!editable ? (
                          <div className="mt-3 text-xs text-zinc-600">
                            Published properties cannot be edited.
                          </div>
                        ) : null}
                        {editable && !valid ? (
                          <div className="mt-3 text-xs text-amber-700">
                            Add required fields (title, description, location, price, at least 1 image) to publish.
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  {rows.length === 0 ? (
                    <div className="p-6 text-sm text-zinc-600">No properties yet.</div>
                  ) : null}
                </div>
              </Card>
            </div>
          </div>
        </TenantShellMain>
      </TenantShell>
    </ProtectedRoute>
  );
}
