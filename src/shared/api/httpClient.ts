import { API_BASE_URL } from '../config/constants';

type ParamValue = string | number | string[];
type Params = Record<string, ParamValue>;

async function get<T>(path: string, params?: Params, signal?: AbortSignal): Promise<T> {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    const parts: string[] = [];
    for (const [k, v] of Object.entries(params)) {
      const key = encodeURIComponent(k);
      if (Array.isArray(v)) {
        v.forEach((item) => parts.push(`${key}=${encodeURIComponent(item)}`));
      } else {
        parts.push(`${key}=${encodeURIComponent(String(v))}`);
      }
    }
    url = `${url}?${parts.join('&')}`;
  }
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
}

export const httpClient = { get, del };
