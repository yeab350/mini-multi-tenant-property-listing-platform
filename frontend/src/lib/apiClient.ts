export type ApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:3001/api"
  );
}

export async function apiJson<T>(
  path: string,
  options?: RequestInit & { accessToken?: string }
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options?.headers);
  headers.set("Accept", "application/json");
  const body = options?.body as unknown;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  if (!headers.has("Content-Type") && options?.body != null && !isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (options?.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const payload: ApiErrorPayload | undefined = isJson
      ? ((await res.json().catch(() => undefined)) as ApiErrorPayload | undefined)
      : undefined;

    const message =
      payload?.message || payload?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  if (!isJson) {
    // Endpoints in this project are expected to be JSON.
    throw new ApiError("Unexpected non-JSON response", res.status);
  }

  return (await res.json()) as T;
}
