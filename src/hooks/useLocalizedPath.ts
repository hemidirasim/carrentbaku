import { useMemo } from 'react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const SUPPORTED_LANGUAGES: Language[] = ['az', 'ru', 'en', 'ar'];

const normalizePath = (path: string) => {
  if (!path.startsWith('/')) {
    return path;
  }
  return path === '/' ? '/' : `/${path.replace(/^\/+/g, '')}`;
};

export const useLocalizedPath = () => {
  const { language } = useLanguage();

  return useMemo(() => {
    const activeLang = SUPPORTED_LANGUAGES.includes(language) ? language : 'az';
    return (path: string) => {
      const normalized = normalizePath(path);
      if (!normalized.startsWith('/')) {
        return normalized;
      }
      if (normalized === '/') {
        return `/${activeLang}`;
      }
      return `/${activeLang}${normalized}`;
    };
  }, [language]);
};

export const stripLanguageFromPath = (path: string) => {
  const normalized = normalizePath(path);
  for (const lang of SUPPORTED_LANGUAGES) {
    const prefix = `/${lang}`;
    if (normalized === prefix) {
      return '/';
    }
    if (normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || '/';
    }
  }
  return normalized;
};
