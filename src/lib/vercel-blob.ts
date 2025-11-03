// Vercel Blob storage utility
const BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_UrgM6GRVtGvrhLeH_r4yaSYb8EP3sTh9Ne0uzT5qsMvPd9t";

export const uploadImage = async (file: File, pathname?: string): Promise<string> => {
  const fileName = pathname || `${Date.now()}-${file.name}`;
  
  // Use PUT method to upload directly to Vercel Blob
  const response = await fetch(`https://blob.vercel-storage.com/${fileName}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
      'Content-Type': file.type,
      'x-content-type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload image: ${errorText}`);
  }

  // The response body contains the URL
  const url = await response.text();
  return url.trim();
};

export const deleteImage = async (url: string): Promise<void> => {
  // Extract the blob path from URL
  const urlObj = new URL(url);
  const blobPath = urlObj.pathname;

  const response = await fetch(`https://blob.vercel-storage.com${blobPath}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${BLOB_READ_WRITE_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
};
