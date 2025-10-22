// Vercel Blob storage utility
const BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_UrgM6GRVtGvrhLeH_r4yaSYb8EP3sTh9Ne0uzT5qsMvPd9t";

export const uploadImage = async (file: File, pathname?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (pathname) {
    formData.append('pathname', pathname);
  }

  const response = await fetch('https://api.vercel.com/blob', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.url;
};

export const deleteImage = async (url: string): Promise<void> => {
  const response = await fetch('https://api.vercel.com/blob', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
};
