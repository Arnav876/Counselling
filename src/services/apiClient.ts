const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:5001/api';
};

export const API_BASE = getApiBase();

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const primaryUrl = `${API_BASE}${cleanPath}`;
  
  const token = localStorage.getItem('abc_auth_token');
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const config: RequestInit = {
    ...options,
    headers
  };

  try {
    const res = await fetch(primaryUrl, config);
    return res;
  } catch (primaryErr) {
    if (primaryUrl.includes(':5001/api')) {
      const proxyUrl = `/api${cleanPath}`;
      try {
        const proxyRes = await fetch(proxyUrl, config);
        return proxyRes;
      } catch {
        throw primaryErr;
      }
    }
    throw primaryErr;
  }
}
