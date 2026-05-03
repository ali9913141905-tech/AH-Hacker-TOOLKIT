const API_URL = '';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('shadow_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers || {}) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(res.status, err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (password: string) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: (token: string) => apiFetch('/api/auth/logout', { method: 'POST', body: JSON.stringify({ token }) }),
  verify: () => apiFetch('/api/auth/verify'),

  getTools: () => apiFetch('/api/tools'),
  addTool: (tool: { title: string; link: string; image: string }) =>
    apiFetch('/api/tools', { method: 'POST', body: JSON.stringify(tool) }),
  deleteTool: (id: number) => apiFetch(`/api/tools/${id}`, { method: 'DELETE' }),
  downloadTool: (id: number) => apiFetch(`/api/tools/${id}/download`, { method: 'POST' }),

  getNotifications: () => apiFetch('/api/notifications'),
  addNotification: (notif: { title: string; message: string; type: string; push: boolean }) =>
    apiFetch('/api/notifications', { method: 'POST', body: JSON.stringify(notif) }),
  readNotifications: () => apiFetch('/api/notifications/read', { method: 'POST' }),
  clearNotifications: () => apiFetch('/api/notifications', { method: 'DELETE' }),

  getSettings: () => apiFetch('/api/settings'),
  changePassword: (data: { type: string; currentPassword: string; newPassword: string }) =>
    apiFetch('/api/settings/password', { method: 'POST', body: JSON.stringify(data) }),
  updateSocial: (socialLinks: Record<string, string>) =>
    apiFetch('/api/settings/social', { method: 'POST', body: JSON.stringify({ socialLinks }) }),

  getDp: () => apiFetch('/api/dp'),
  uploadDp: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/api/dp`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new ApiError(res.status, 'Upload failed');
    return res.json();
  },

  getActiveUsers: () => apiFetch('/api/users/active'),
  getSync: () => apiFetch('/api/sync'),
};
