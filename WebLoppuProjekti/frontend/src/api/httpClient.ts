const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL ?? "http://localhost:3000";

function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("authToken");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    // if no content
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  let message = "Request failed";
  try {
    const data = await response.json();
    if (data?.error) message = data.error;
    else if (data?.message) message = data.message;
  } catch (_) {
    // ignore parse errors
  }
  throw new Error(message);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = Boolean(init?.body);
  const headers = { ...buildHeaders(hasBody), ...init?.headers };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  return handleResponse<T>(response);
}

export function apiGet<T>(path: string, options?: RequestInit) {
  return request<T>(path, { ...options, method: "GET" });
}

export function apiPost<TBody, TResponse>(path: string, body: TBody, options?: RequestInit) {
  return request<TResponse>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut<TBody, TResponse>(path: string, body: TBody, options?: RequestInit) {
  return request<TResponse>(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<TResponse>(path: string, options?: RequestInit) {
  return request<TResponse>(path, { ...options, method: "DELETE" });
}

export { API_BASE_URL };
