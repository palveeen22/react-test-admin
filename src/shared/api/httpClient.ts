import { API_BASE_URL } from '../config/constants';

type ParamValue = string | number | string[];
type Params = Record<string, ParamValue>;

export class HttpError extends Error {
  status: number;
  constructor(status: number, path: string) {
    super(`HTTP ${status}: ${path}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

const HTTP_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Необходима авторизация',
  403: 'Доступ запрещён',
  404: 'Данные не найдены',
  500: 'Ошибка сервера',
  502: 'Сервер недоступен',
  503: 'Сервис временно недоступен',
};

export function getHttpErrorMessage(e: unknown): string {
  if (e instanceof HttpError) {
    return HTTP_MESSAGES[e.status] ?? `Ошибка сервера (${e.status})`;
  }
  if (e instanceof TypeError && e.message === 'Failed to fetch') {
    return 'Нет соединения с сервером';
  }
  return 'Произошла непредвиденная ошибка';
}

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
  if (!res.ok) throw new HttpError(res.status, path);
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new HttpError(res.status, path);
}

export const httpClient = { get, del };
