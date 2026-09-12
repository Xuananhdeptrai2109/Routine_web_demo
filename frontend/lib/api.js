// Routine API Client
const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/+$/, '');
const API_BASE = RAW_API_BASE.endsWith('/api/v1') ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`;

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let token = null;
  let guestSessionId = null;

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('routine_token') || localStorage.getItem('token');
    if (stored) {
      try {
        const parts = stored.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const notExpired = !payload.exp || payload.exp * 1000 > Date.now();
          if (notExpired) {
            token = stored;
          }
        }
      } catch (e) {
        // fallback
      }
    }

    // Quản lý guest session id duy nhất trong localStorage
    guestSessionId = localStorage.getItem('routine_guest_session_id');
    if (!guestSessionId) {
      guestSessionId = 'g_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem('routine_guest_session_id', guestSessionId);
    }
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (guestSessionId) {
    headers['x-session-id'] = guestSessionId;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const returnSessionId = res.headers.get('x-session-id');
    if (returnSessionId && typeof window !== 'undefined') {
      localStorage.setItem('routine_guest_session_id', returnSessionId);
    }

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(json?.message || `API error: ${res.status}`);
    }
    return json?.data !== undefined ? json.data : json;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export default fetchApi;
