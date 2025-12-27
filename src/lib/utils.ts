import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize image URL - handles various formats and ensures correct path
 */
export function normalizeImageUrl(url: string | any): string {
  if (!url) return '';
  
  // Handle object format
  if (url && typeof url === 'object' && url.url) {
    url = url.url;
  }
  
  // Handle string format
  if (typeof url === 'string') {
    // Try to parse as JSON (for Vercel Blob format)
    try {
      const parsed = JSON.parse(url);
      if (typeof parsed === 'string') {
        url = parsed;
      } else if (parsed && typeof parsed === 'object' && parsed.url) {
        url = parsed.url;
      }
    } catch {
      // Not JSON, use as is
    }
    
    // Ensure /uploads/ paths are absolute (start with /)
    if (url.startsWith('/uploads/')) {
      return url;
    }
    
    // If it's a relative path starting with uploads, make it absolute
    if (url.startsWith('uploads/')) {
      return '/' + url;
    }
    
    // If it's already a full URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Return as is for other cases
    return url;
  }
  
  return '';
}
