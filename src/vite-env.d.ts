/// <reference types="vite/client" />

// Google Tag Manager types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};
