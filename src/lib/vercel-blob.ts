
const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin.replace(/\/$/, '');
    return `${origin}/api`;
  }
  return 'http://localhost:3001/api';
};

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  getDefaultApiUrl();

const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('admin_token');
};

const buildUploadUrl = (pathname?: string) => {
  const url = new URL(`${API_URL}/uploads`);
  if (pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const fileName = parts.pop();
    if (parts.length > 0) {
      url.searchParams.set('folder', parts.join('/'));
    }
    if (fileName) {
      url.searchParams.set('filename', fileName);
    }
  }
  return url;
};

export const uploadImage = async (file: File, pathname?: string): Promise<string> => {
  const token = getAuthToken();
  const uploadUrl = buildUploadUrl(pathname);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(uploadUrl.toString(), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => 'Failed to upload image');
    throw new Error(message || 'Failed to upload image');
  }

  const data = await response.json().catch(() => null);
  if (!data || typeof data.url !== 'string') {
    throw new Error('Invalid upload response');
  }

  return data.url;
};

export const deleteImage = async (url: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/uploads`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok && response.status !== 404) {
    const message = await response.text().catch(() => 'Failed to delete image');
    throw new Error(message || 'Failed to delete image');
  }
};
