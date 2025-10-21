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
    
    // Reservation
    'reservation.title': 'Avtomobil rezervasiyası et',
    'reservation.forCar': 'üçün rezervasiya et',
    'reservation.startDate': 'Başlama tarixi',
    'reservation.endDate': 'Bitmə tarixi',
    'reservation.select': 'Seçin',
    'reservation.pickupLocation': 'Götürmə yeri',
    'reservation.dropoffLocation': 'Qaytarma yeri',
    'reservation.selectLocation': 'Yer seçin',
    'reservation.location.office': 'Baş ofis',
    'reservation.location.airport': 'Hava limanı',
    'reservation.location.hotel': 'Bakıda istənilən hotel',
    'reservation.additionalOptions': 'Əlavə seçimlər',
    'reservation.options.childSeat': 'Uşaq oturacağı',
    'reservation.options.videoRecorder': 'Video qeydiyyatçı',
    'reservation.submit': 'Rezervasiya Et',
    'reservation.error': 'Xəta',
    'reservation.fillAll': 'Zəhmət olmasa bütün xanaları doldurun',
    'reservation.success': 'Uğurlu!',
    'reservation.successMsg': 'Rezervasiyanız qeydə alındı. Tezliklə sizinlə əlaqə saxlanılacaq.',
    'reservation.namePlaceholder': 'Adınız və soyadınız',
    
    // Car Categories
    'cars.filter.ekonomik': 'Ekonomik avtomobillər',
    'cars.filter.biznes': 'Biznes avtomobilləri',
    'cars.filter.suv': 'SUV tipli avtomobillər',
    'cars.filter.minivan': 'Minivanlar',
    
    // FAQ
    'faq.title': 'Tez-tez verilən suallar',
    'faq.q1': 'Avtomobil kirayə etmək üçün hansı sənədlər lazımdır?',
    'faq.a1': 'Avtomobil kirayə etmək üçün sizə yalnız sürücülük vəsiqəsi, şəxsiyyət vəsiqəsi və kredit kartı lazımdır. Xarici vətəndaşlar üçün beynəlxalq sürücülük vəsiqəsi tələb olunur.',
    'faq.q2': 'Minimum neçə yaşda avtomobil kirayə edə bilərəm?',
    'faq.a2': 'Avtomobil kirayə etmək üçün minimum yaş 21-dir. Bəzi premium və lüks avtomobillər üçün minimum yaş 25 ola bilər.',
    'faq.q3': 'Depozit nə zaman qaytarılır?',
    'faq.a3': 'Depozit avtomobili qaytardıqdan sonra 3-5 iş günü ərzində sizin kredit kartınıza qaytarılır. Avtomobilda heç bir ziyan olmadığı təqdirdə depozit tam qaytarılır.',
    'faq.q4': 'Hava limanından avtomobil götürə bilərəmmi?',
    'faq.a4': 'Bəli, biz Heydər Əliyev Beynəlxalq Hava Limanından pulsuz təhvil-təslim xidməti təqdim edirik. Siz avtomobili hava limanından götürüb istədiyiniz yerdə qaytara bilərsiniz.',
    'faq.q5': 'Günlük kilometr limiti varmı?',
    'faq.a5': 'Xeyr, bizim avtomobillərimizdə gündəlik kilometr limiti yoxdur. Siz avtomobili limitsiz istifadə edə bilərsiniz.',
    'faq.q6': 'Avtomobilə əlavə sürücü əlavə edə bilərəmmi?',
    'faq.a6': 'Bəli, əlavə sürücü əlavə etmək mümkündür. Əlavə sürücü üçün kiçik bir ödəniş tələb olunur və o da eyni sənədləri təqdim etməlidir.',
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
    
    // Reservation
    'reservation.title': 'Бронирование автомобиля',
    'reservation.forCar': 'бронирование',
    'reservation.startDate': 'Дата начала',
    'reservation.endDate': 'Дата окончания',
    'reservation.select': 'Выберите',
    'reservation.pickupLocation': 'Место получения',
    'reservation.dropoffLocation': 'Место возврата',
    'reservation.selectLocation': 'Выберите место',
    'reservation.location.office': 'Главный офис',
    'reservation.location.airport': 'Аэропорт',
    'reservation.location.hotel': 'Любой отель в Баку',
    'reservation.additionalOptions': 'Дополнительные опции',
    'reservation.options.childSeat': 'Детское кресло',
    'reservation.options.videoRecorder': 'Видеорегистратор',
    'reservation.submit': 'Забронировать',
    'reservation.error': 'Ошибка',
    'reservation.fillAll': 'Пожалуйста, заполните все поля',
    'reservation.success': 'Успешно!',
    'reservation.successMsg': 'Ваше бронирование принято. Мы свяжемся с вами в ближайшее время.',
    'reservation.namePlaceholder': 'Ваше имя и фамилия',
    
    // Car Categories
    'cars.filter.ekonomik': 'Эконом автомобили',
    'cars.filter.biznes': 'Бизнес автомобили',
    'cars.filter.suv': 'Автомобили типа SUV',
    'cars.filter.minivan': 'Минивэны',
    
    // FAQ
    'faq.title': 'Часто задаваемые вопросы',
    'faq.q1': 'Какие документы нужны для аренды автомобиля?',
    'faq.a1': 'Для аренды автомобиля вам понадобятся только водительские права, удостоверение личности и кредитная карта. Для иностранных граждан требуются международные водительские права.',
    'faq.q2': 'С какого возраста можно арендовать автомобиль?',
    'faq.a2': 'Минимальный возраст для аренды автомобиля - 21 год. Для некоторых премиум и люксовых автомобилей минимальный возраст может быть 25 лет.',
    'faq.q3': 'Когда возвращается депозит?',
    'faq.a3': 'Депозит возвращается на вашу кредитную карту в течение 3-5 рабочих дней после возврата автомобиля. При отсутствии повреждений депозит возвращается полностью.',
    'faq.q4': 'Можно ли получить автомобиль в аэропорту?',
    'faq.a4': 'Да, мы предоставляем бесплатную услугу доставки и получения автомобиля в Международном аэропорту Гейдара Алиева. Вы можете забрать автомобиль в аэропорту и вернуть его в любом месте.',
    'faq.q5': 'Есть ли дневной лимит километража?',
    'faq.a5': 'Нет, наши автомобили не имеют дневного лимита километража. Вы можете использовать автомобиль без ограничений.',
    'faq.q6': 'Можно ли добавить дополнительного водителя?',
    'faq.a6': 'Да, можно добавить дополнительного водителя. За дополнительного водителя взимается небольшая плата, и он должен предоставить те же документы.',
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
    
    // Reservation
    'reservation.title': 'Car Reservation',
    'reservation.forCar': 'reservation',
    'reservation.startDate': 'Start Date',
    'reservation.endDate': 'End Date',
    'reservation.select': 'Select',
    'reservation.pickupLocation': 'Pickup Location',
    'reservation.dropoffLocation': 'Drop-off Location',
    'reservation.selectLocation': 'Select location',
    'reservation.location.office': 'Main office',
    'reservation.location.airport': 'Airport',
    'reservation.location.hotel': 'Any hotel in Baku',
    'reservation.additionalOptions': 'Additional Options',
    'reservation.options.childSeat': 'Child seat',
    'reservation.options.videoRecorder': 'Video recorder',
    'reservation.submit': 'Reserve',
    'reservation.error': 'Error',
    'reservation.fillAll': 'Please fill in all fields',
    'reservation.success': 'Success!',
    'reservation.successMsg': 'Your reservation has been received. We will contact you shortly.',
    'reservation.namePlaceholder': 'Your full name',
    
    // Car Categories
    'cars.filter.ekonomik': 'Economy Cars',
    'cars.filter.biznes': 'Business Cars',
    'cars.filter.suv': 'SUV Type Cars',
    'cars.filter.minivan': 'Minivans',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'What documents are required to rent a car?',
    'faq.a1': 'To rent a car, you only need a driver\'s license, ID card, and credit card. For foreign citizens, an international driver\'s license is required.',
    'faq.q2': 'What is the minimum age to rent a car?',
    'faq.a2': 'The minimum age to rent a car is 21 years old. For some premium and luxury cars, the minimum age may be 25 years old.',
    'faq.q3': 'When is the deposit refunded?',
    'faq.a3': 'The deposit is refunded to your credit card within 3-5 business days after returning the car. If there is no damage to the car, the deposit is fully refunded.',
    'faq.q4': 'Can I pick up the car at the airport?',
    'faq.a4': 'Yes, we provide free delivery and pickup service at Heydar Aliyev International Airport. You can pick up the car at the airport and return it anywhere.',
    'faq.q5': 'Is there a daily mileage limit?',
    'faq.a5': 'No, our cars have no daily mileage limit. You can use the car unlimited.',
    'faq.q6': 'Can I add an additional driver?',
    'faq.a6': 'Yes, you can add an additional driver. A small fee is required for an additional driver and they must provide the same documents.',
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
    
    // Reservation
    'reservation.title': 'حجز السيارة',
    'reservation.forCar': 'حجز',
    'reservation.startDate': 'تاريخ البداية',
    'reservation.endDate': 'تاريخ الانتهاء',
    'reservation.select': 'اختر',
    'reservation.pickupLocation': 'مكان الاستلام',
    'reservation.dropoffLocation': 'مكان التسليم',
    'reservation.selectLocation': 'اختر المكان',
    'reservation.location.office': 'المكتب الرئيسي',
    'reservation.location.airport': 'المطار',
    'reservation.location.hotel': 'أي فندق في باكو',
    'reservation.additionalOptions': 'خيارات إضافية',
    'reservation.options.childSeat': 'مقعد الأطفال',
    'reservation.options.videoRecorder': 'مسجل فيديو',
    'reservation.submit': 'احجز',
    'reservation.error': 'خطأ',
    'reservation.fillAll': 'يرجى ملء جميع الحقول',
    'reservation.success': 'نجاح!',
    'reservation.successMsg': 'تم استلام حجزك. سنتصل بك قريبًا.',
    'reservation.namePlaceholder': 'اسمك الكامل',
    
    // Car Categories
    'cars.filter.ekonomik': 'سيارات اقتصادية',
    'cars.filter.biznes': 'سيارات الأعمال',
    'cars.filter.suv': 'سيارات SUV',
    'cars.filter.minivan': 'ميني فان',
    
    // FAQ
    'faq.title': 'الأسئلة المتكررة',
    'faq.q1': 'ما هي المستندات المطلوبة لاستئجار سيارة؟',
    'faq.a1': 'لاستئجار سيارة، تحتاج فقط إلى رخصة قيادة وبطاقة هوية وبطاقة ائتمان. بالنسبة للمواطنين الأجانب، يلزم رخصة قيادة دولية.',
    'faq.q2': 'ما هو الحد الأدنى لسن استئجار سيارة؟',
    'faq.a2': 'الحد الأدنى لسن استئجار سيارة هو 21 عامًا. بالنسبة لبعض السيارات الفاخرة والفاخرة، قد يكون الحد الأدنى للسن 25 عامًا.',
    'faq.q3': 'متى يتم استرداد الوديعة؟',
    'faq.a3': 'يتم استرداد الوديعة إلى بطاقة الائتمان الخاصة بك في غضون 3-5 أيام عمل بعد إرجاع السيارة. إذا لم يكن هناك ضرر للسيارة، يتم استرداد الوديعة بالكامل.',
    'faq.q4': 'هل يمكنني استلام السيارة في المطار؟',
    'faq.a4': 'نعم، نوفر خدمة توصيل واستلام مجانية في مطار حيدر علييف الدولي. يمكنك استلام السيارة في المطار وإعادتها في أي مكان.',
    'faq.q5': 'هل هناك حد أقصى للمسافة اليومية؟',
    'faq.a5': 'لا، سياراتنا ليس لديها حد أقصى للمسافة اليومية. يمكنك استخدام السيارة بدون حدود.',
    'faq.q6': 'هل يمكنني إضافة سائق إضافي؟',
    'faq.a6': 'نعم، يمكنك إضافة سائق إضافي. يلزم رسوم صغيرة للسائق الإضافي ويجب عليه تقديم نفس المستندات.',
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
