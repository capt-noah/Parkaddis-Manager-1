const BASE_URL = 'https://park-addis.onrender.com/api';

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  status: number;
};

let sessionId: string | null = null;

export const setApiSessionId = (id: string | null) => {
  sessionId = id;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (sessionId) {
    headers.set('Authorization', `Bearer ${sessionId}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {

      return {
        ok: false,
        error: data?.message || data?.error || response.statusText,
        status: response.status,
      };
    }

    return {
      ok: true,
      data: data as T,
      status: response.status,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || 'Network request failed',
      status: 0,
    };
  }
}
