export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: string };

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(
  file: File,
  opts: { maxBytes: number } = { maxBytes: 5 * 1024 * 1024 }
): ImageValidationResult {
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: `Unsupported type: ${file.type || "(unknown)"}. Use JPG/PNG/WebP.`,
    };
  }

  if (file.size > opts.maxBytes) {
    const mb = (opts.maxBytes / (1024 * 1024)).toFixed(0);
    return { ok: false, error: `File too large. Max ${mb}MB.` };
  }

  return { ok: true };
}
