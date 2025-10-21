import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'az' | 'ru' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  az: {
    // Header
    'nav.home': 'Ana Səhifə',
    'nav.cars': 'Avtomobillər',
    'nav.services': 'Xidmətlər',
    'nav.about': 'Haqqımızda',
    'nav.contact': 'Əlaqə',
    'nav.blog': 'Blog',
    'nav.reserve': 'Rezerv et',
    
    // Hero
    'hero.title': 'Bakıda Premium Avtomobil Kirayəsi',
    'hero.subtitle': 'Kirayə maşınlar 55 AZN-dən başlayır',
    'hero.cta': 'İndi Rezerv Et',
    
    // Services
    'services.title': 'Xidmətlərimiz',
    'services.rental': 'Avtomobil Kirayəsi',
    'services.rental.desc': 'Geniş çeşiddə avtomobillər',
    'services.airport': 'Hava Limanı Transferi',
    'services.airport.desc': '24/7 hava limanı xidməti',
    'services.daily': 'Günlük Kirayə',
    'services.daily.desc': 'Əlverişli günlük tariflər',
    'services.driver': 'Şəxsi Sürücü',
    'services.driver.desc': 'Təcrübəli sürücülərimiz',
    
    // Cars
    'cars.title': 'Populyar Avtomobillərimiz',
    'cars.perDay': 'gün',
    'cars.viewAll': 'Bütün Avtomobilləri Gör',
    'cars.viewDetails': 'Ətraflı Bax',
    'cars.filter.all': 'Hamısı',
    'cars.filter.economy': 'Ekonom',
    'cars.filter.comfort': 'Komfort',
    'cars.filter.premium': 'Premium',
    'cars.filter.brand': 'Brend',
    'cars.search': 'Avtomobil axtar...',
    'cars.price': 'Qiymət aralığı',
    'cars.price.all': 'Bütün qiymətlər',
    'cars.reset': 'Sıfırla',
    'cars.noResults': 'Axtarış nəticəsində avtomobil tapılmadı',
    'cars.header': 'Geniş avtomobil parkımızdan seçim edin',
    
    // Car Detail
    'detail.specs': 'Texniki Xüsusiyyətlər',
    'detail.seats': 'Oturacaq',
    'detail.year': 'İl',
    'detail.fuel': 'Yanacaq',
    'detail.price': 'Günlük Qiymət',
    'detail.deposit': 'Depozit',
    'detail.features': 'Xüsusiyyətlər',
    'detail.gallery': 'Foto Qalereya',
    'detail.reserve': 'İndi Rezerv Et',
    
    // Reviews
    'reviews.title': 'Müştəri Rəyləri',
    'reviews.subtitle': 'Real müştərilərimizin fikirləri',
    
    // Contact
    'contact.title': 'Bizimlə Əlaqə',
    'contact.name': 'Adınız',
    'contact.email': 'E-mail',
    'contact.message': 'Mesajınız',
    'contact.send': 'Göndər',
    'contact.phone': 'Telefon',
    'contact.address': 'Ünvan',
    
    // Footer
    'footer.description': 'Bakıda ən etibarlı avtomobil kirayə xidməti',
    'footer.links': 'Keçidlər',
    'footer.legal': 'Hüquqi',
    'footer.terms': 'İstifadə Qaydaları',
    'footer.privacy': 'Məxfilik Siyasəti',
    'footer.rights': '© 2024 CARRENTBAKU.AZ. Bütün hüquqlar qorunur.',
    
    // About
    'about.title': 'Haqqımızda',
    'about.subtitle': '2016-cı ildən etibar və keyfiyyət',
    'about.description': 'CARRENTBAKU.AZ olaraq, 2016-cı ildən Bakıda premium avtomobil kirayə xidməti təqdim edirik. Müştəri məmnuniyyəti bizim prioritetimizdir.',
    
    // CTA
    'cta.title': 'İdeal Avtomobilinizi Seçin',
    'cta.subtitle': 'Bakının ən yaxşı avtomobil kirayə xidməti',
    'cta.button': 'İndi Əlaqə Saxlayın',
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Ən son xəbərlər və məqalələr',
    'blog.readMore': 'Ətraflı Oxu',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.cars': 'Автомобили',
    'nav.services': 'Услуги',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.blog': 'Блог',
    'nav.reserve': 'Забронировать',
    
    'hero.title': 'Премиум аренда авто в Баку',
    'hero.subtitle': 'Аренда авто от 55 AZN',
    'hero.cta': 'Забронировать сейчас',
    
    'services.title': 'Наши услуги',
    'services.rental': 'Аренда автомобилей',
    'services.rental.desc': 'Широкий выбор автомобилей',
    'services.airport': 'Трансфер из аэропорта',
    'services.airport.desc': 'Услуги 24/7',
    'services.daily': 'Посуточная аренда',
    'services.daily.desc': 'Выгодные тарифы',
    'services.driver': 'Личный водитель',
    'services.driver.desc': 'Опытные водители',
    
    'cars.title': 'Популярные автомобили',
    'cars.perDay': 'день',
    'cars.viewAll': 'Все автомобили',
    'cars.viewDetails': 'Подробнее',
    'cars.filter.all': 'Все',
    'cars.filter.economy': 'Эконом',
    'cars.filter.comfort': 'Комфорт',
    'cars.filter.premium': 'Премиум',
    'cars.filter.brand': 'Бренд',
    'cars.search': 'Поиск авто...',
    'cars.price': 'Диапазон цен',
    'cars.price.all': 'Все цены',
    'cars.reset': 'Сбросить',
    'cars.noResults': 'Автомобили не найдены',
    'cars.header': 'Выберите из широкого парка автомобилей',
    
    'detail.specs': 'Технические характеристики',
    'detail.seats': 'Мест',
    'detail.year': 'Год',
    'detail.fuel': 'Топливо',
    'detail.price': 'Цена в день',
    'detail.deposit': 'Депозит',
    'detail.features': 'Особенности',
    'detail.gallery': 'Фотогалерея',
    'detail.reserve': 'Забронировать',
    
    'reviews.title': 'Отзывы клиентов',
    'reviews.subtitle': 'Мнения наших клиентов',
    
    'contact.title': 'Свяжитесь с нами',
    'contact.name': 'Ваше имя',
    'contact.email': 'E-mail',
    'contact.message': 'Ваше сообщение',
    'contact.send': 'Отправить',
    'contact.phone': 'Телефон',
    'contact.address': 'Адрес',
    
    'footer.description': 'Самый надежный сервис аренды авто в Баку',
    'footer.links': 'Ссылки',
    'footer.legal': 'Юридическая информация',
    'footer.terms': 'Условия использования',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.rights': '© 2024 CARRENTBAKU.AZ. Все права защищены.',
    
    'about.title': 'О нас',
    'about.subtitle': 'Доверие и качество с 2016 года',
    'about.description': 'CARRENTBAKU.AZ предоставляет премиум услуги аренды автомобилей в Баку с 2016 года. Удовлетворенность клиентов - наш приоритет.',
    
    'cta.title': 'Выберите идеальный автомобиль',
    'cta.subtitle': 'Лучший сервис аренды авто в Баку',
    'cta.button': 'Связаться сейчас',
    
    'blog.title': 'Блог',
    'blog.subtitle': 'Последние новости и статьи',
    'blog.readMore': 'Читать далее',
  },
  en: {
    'nav.home': 'Home',
    'nav.cars': 'Cars',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.reserve': 'Reserve',
    
    'hero.title': 'Premium Car Rental in Baku',
    'hero.subtitle': 'Car rental from 55 AZN',
    'hero.cta': 'Reserve Now',
    
    'services.title': 'Our Services',
    'services.rental': 'Car Rental',
    'services.rental.desc': 'Wide range of vehicles',
    'services.airport': 'Airport Transfer',
    'services.airport.desc': '24/7 airport service',
    'services.daily': 'Daily Rental',
    'services.daily.desc': 'Affordable daily rates',
    'services.driver': 'Personal Driver',
    'services.driver.desc': 'Experienced drivers',
    
    'cars.title': 'Popular Cars',
    'cars.perDay': 'day',
    'cars.viewAll': 'View All Cars',
    'cars.viewDetails': 'View Details',
    'cars.filter.all': 'All',
    'cars.filter.economy': 'Economy',
    'cars.filter.comfort': 'Comfort',
    'cars.filter.premium': 'Premium',
    'cars.filter.brand': 'Brand',
    'cars.search': 'Search cars...',
    'cars.price': 'Price Range',
    'cars.price.all': 'All prices',
    'cars.reset': 'Reset',
    'cars.noResults': 'No cars found',
    'cars.header': 'Choose from our wide range of vehicles',
    
    'detail.specs': 'Specifications',
    'detail.seats': 'Seats',
    'detail.year': 'Year',
    'detail.fuel': 'Fuel',
    'detail.price': 'Daily Rate',
    'detail.deposit': 'Deposit',
    'detail.features': 'Features',
    'detail.gallery': 'Photo Gallery',
    'detail.reserve': 'Reserve Now',
    
    'reviews.title': 'Customer Reviews',
    'reviews.subtitle': 'What our customers say',
    
    'contact.title': 'Contact Us',
    'contact.name': 'Your Name',
    'contact.email': 'E-mail',
    'contact.message': 'Your Message',
    'contact.send': 'Send',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    
    'footer.description': 'Most reliable car rental service in Baku',
    'footer.links': 'Links',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': '© 2024 CARRENTBAKU.AZ. All rights reserved.',
    
    'about.title': 'About Us',
    'about.subtitle': 'Trust and quality since 2016',
    'about.description': 'CARRENTBAKU.AZ has been providing premium car rental services in Baku since 2016. Customer satisfaction is our priority.',
    
    'cta.title': 'Choose Your Perfect Car',
    'cta.subtitle': 'Best car rental service in Baku',
    'cta.button': 'Contact Now',
    
    'blog.title': 'Blog',
    'blog.subtitle': 'Latest news and articles',
    'blog.readMore': 'Read More',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.cars': 'السيارات',
    'nav.services': 'الخدمات',
    'nav.about': 'عن الشركة',
    'nav.contact': 'اتصل بنا',
    'nav.blog': 'المدونة',
    'nav.reserve': 'احجز الآن',
    
    'hero.title': 'تأجير سيارات فاخرة في باكو',
    'hero.subtitle': 'تأجير السيارات من 55 مانات',
    'hero.cta': 'احجز الآن',
    
    'services.title': 'خدماتنا',
    'services.rental': 'تأجير السيارات',
    'services.rental.desc': 'مجموعة واسعة من السيارات',
    'services.airport': 'نقل المطار',
    'services.airport.desc': 'خدمة المطار على مدار الساعة',
    'services.daily': 'تأجير يومي',
    'services.daily.desc': 'أسعار يومية معقولة',
    'services.driver': 'سائق خاص',
    'services.driver.desc': 'سائقون ذوو خبرة',
    
    'cars.title': 'السيارات الشعبية',
    'cars.perDay': 'يوم',
    'cars.viewAll': 'عرض جميع السيارات',
    'cars.viewDetails': 'عرض التفاصيل',
    'cars.filter.all': 'الكل',
    'cars.filter.economy': 'اقتصادي',
    'cars.filter.comfort': 'مريح',
    'cars.filter.premium': 'فاخر',
    'cars.filter.brand': 'العلامة التجارية',
    'cars.search': 'البحث عن السيارات...',
    'cars.price': 'نطاق السعر',
    'cars.price.all': 'جميع الأسعار',
    'cars.reset': 'إعادة تعيين',
    'cars.noResults': 'لم يتم العثور على سيارات',
    'cars.header': 'اختر من مجموعة واسعة من السيارات',
    
    'detail.specs': 'المواصفات',
    'detail.seats': 'المقاعد',
    'detail.year': 'السنة',
    'detail.fuel': 'الوقود',
    'detail.price': 'السعر اليومي',
    'detail.deposit': 'التأمين',
    'detail.features': 'المميزات',
    'detail.gallery': 'معرض الصور',
    'detail.reserve': 'احجز الآن',
    
    'reviews.title': 'آراء العملاء',
    'reviews.subtitle': 'ماذا يقول عملاؤنا',
    
    'contact.title': 'اتصل بنا',
    'contact.name': 'اسمك',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال',
    'contact.phone': 'الهاتف',
    'contact.address': 'العنوان',
    
    'footer.description': 'أكثر خدمة تأجير سيارات موثوقة في باكو',
    'footer.links': 'روابط',
    'footer.legal': 'قانوني',
    'footer.terms': 'شروط الخدمة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.rights': '© 2024 CARRENTBAKU.AZ. جميع الحقوق محفوظة.',
    
    'about.title': 'عن الشركة',
    'about.subtitle': 'الثقة والجودة منذ 2016',
    'about.description': 'تقدم CARRENTBAKU.AZ خدمات تأجير سيارات فاخرة في باكو منذ عام 2016. رضا العملاء هو أولويتنا.',
    
    'cta.title': 'اختر سيارتك المثالية',
    'cta.subtitle': 'أفضل خدمة تأجير سيارات في باكو',
    'cta.button': 'اتصل الآن',
    
    'blog.title': 'المدونة',
    'blog.subtitle': 'أحدث الأخبار والمقالات',
    'blog.readMore': 'اقرأ المزيد',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('az');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['az', 'ru', 'en', 'ar'].includes(savedLang)) {
      setLanguage(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
