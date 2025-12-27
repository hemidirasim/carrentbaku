import { Language } from '@/contexts/LanguageContext';

export interface SeoEntry {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const DEFAULT_OG_IMAGE = 'https://i.ibb.co/nsddrf2M/template.png';

export const SEO_CONFIG: Record<Language, SeoEntry> = {
  az: {
    title: 'CARRENTBAKU.AZ | Rent a Car Baku - Premium Avtomobil İcarəsi',
    description:
      'Bakıda premium rent a car xidmətləri: hava limanı qarşılama, sürücü ilə və sürücüsüz avtomobil icarəsi. CARRENTBAKU.AZ ilə Bakıda rahat və təhlükəsiz maşın icarə edin.',
    keywords: [
      'rent a car baku',
      'car rent baku',
      'avtomobil icarəsi bakı',
      'bakıda maşın icarəsi',
      'premium rent a car bakı',
      'airport car rental baku',
    ],
    image: DEFAULT_OG_IMAGE,
  },
  ru: {
    title: 'CARRENTBAKU.AZ | Rent a Car Baku — Аренда авто в Баку',
    description:
      'Современный сервис аренды авто в Баку: прокат без водителя, трансфер в аэропорт и премиальные автомобили. CARRENTBAKU.AZ — надежный rent a car в Азербайджане.',
    keywords: [
      'rent a car baku',
      'car rent baku',
      'аренда авто баку',
      'прокат автомобилей в баку',
      'аренда машины аэропорт баку',
      'premium car rental baku',
    ],
    image: DEFAULT_OG_IMAGE,
  },
  en: {
    title: 'CARRENTBAKU.AZ | Rent a Car Baku & Luxury Car Hire',
    description:
      'Rent a car in Baku with airport delivery, chauffeur service and luxury fleets. CARRENTBAKU.AZ offers trusted car hire solutions across Azerbaijan.',
    keywords: [
      'rent a car baku',
      'car rent baku',
      'car rental baku',
      'baku car hire',
      'airport car rental baku',
      'luxury car rental azerbaijan',
    ],
    image: DEFAULT_OG_IMAGE,
  },
  ar: {
    title: 'CARRENTBAKU.AZ | Rent a Car Baku - تأجير سيارات في باكو',
    description:
      'خدمة تأجير السيارات في باكو مع توصيل للمطار وخيارات فاخرة وسائق خاص. احجز سيارتك مع CARRENTBAKU.AZ واستمتع برحلة مريحة في أذربيجان.',
    keywords: [
      'rent a car baku',
      'car rent baku',
      'تأجير سيارات باكو',
      'استئجار سيارة في باكو',
      'توصيل من المطار باكو',
      'تأجير سيارات فاخرة اذربيجان',
    ],
    image: DEFAULT_OG_IMAGE,
  },
};
