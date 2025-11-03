import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@carrentbaku.az' },
    update: {},
    create: {
      email: 'admin@carrentbaku.az',
      password_hash: hashedPassword,
      name: 'Admin User',
      roles: {
        create: {
          role: 'admin',
        },
      },
    },
  });
  console.log('✅ Admin user created');

  // Create cars
  const cars = [
    {
      brand: 'Hyundai',
      model: 'Elantra',
      year: 2023,
      category: 'ekonomik',
      price_per_day: 55,
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      seats: 5,
      image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
      features: ['Bluetooth', 'Air Conditioning', 'GPS Navigation'],
      available: true,
    },
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      category: 'biznes',
      price_per_day: 85,
      fuel_type: 'Hybrid',
      transmission: 'Automatic',
      seats: 5,
      image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
      features: ['Bluetooth', 'Sunroof', 'Air Conditioning', 'GPS Navigation'],
      available: true,
    },
    {
      brand: 'Mercedes',
      model: 'E-Class',
      year: 2024,
      category: 'premium',
      price_per_day: 150,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      seats: 5,
      image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
      features: ['Sport Package', 'Premium Sound', 'Adaptive Cruise', 'Lane Assist'],
      available: true,
    },
    {
      brand: 'BMW',
      model: '5 Series',
      year: 2024,
      category: 'premium',
      price_per_day: 180,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      seats: 5,
      image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      features: ['Sport Package', 'Premium Sound', 'Adaptive Cruise', 'Parking Assistant'],
      available: true,
    },
    {
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: 2024,
      category: 'suv',
      price_per_day: 200,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      seats: 7,
      image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      features: ['4WD', 'Premium Sound', 'Sunroof', 'GPS Navigation'],
      available: true,
    },
    {
      brand: 'Mercedes',
      model: 'V-Class',
      year: 2023,
      category: 'minivan',
      price_per_day: 180,
      fuel_type: 'Diesel',
      transmission: 'Automatic',
      seats: 8,
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
      features: ['Bluetooth', 'Air Conditioning', 'GPS Navigation', 'Rear Entertainment'],
      available: true,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: car,
    });
  }
  console.log('✅ Cars created');

  // Create services
  const services = [
    {
      title_az: 'Günlük və Həftəlik İcarə',
      title_ru: 'Ежедневная и Еженедельная Аренда',
      title_en: 'Daily and Weekly Rental',
      title_ar: 'الإيجار اليومي والأسبوعي',
      description_az: 'Qısa müddətli səyahətlər üçün ideal. Minimum 1 gün, maksimum həftəlik icarə seçimləri.',
      description_ru: 'Идеально для краткосрочных поездок. Минимум 1 день, максимум недельная аренда.',
      description_en: 'Perfect for short-term trips. Minimum 1 day, maximum weekly rental options.',
      description_ar: 'مثالي للرحلات قصيرة المدى. الحد الأدنى يوم واحد، خيارات الإيجار الأسبوعي بحد أقصى.',
      image_url: 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600',
      category: 'daily-weekly',
    },
    {
      title_az: 'Uzun Müddətli İcarə',
      title_ru: 'Долгосрочная Аренда',
      title_en: 'Long Term Rental',
      title_ar: 'الإيجار طويل الأمد',
      description_az: 'Bir ay və ya daha uzun müddətə xüsusi qiymətlər. Ən yaxşı qiymət təklifləri.',
      description_ru: 'Специальные цены на месяц или дольше. Лучшие предложения.',
      description_en: 'Special rates for a month or longer. Best price offers.',
      description_ar: 'أسعار خاصة لمدة شهر أو أطول. أفضل عروض الأسعار.',
      image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600',
      category: 'long-term',
    },
    {
      title_az: 'Lüks Avtomobillər',
      title_ru: 'Люксовые Автомобили',
      title_en: 'Luxury Cars',
      title_ar: 'سيارات فاخرة',
      description_az: 'Premium markalar və lüks avtomobillər. Unudulmaz səyahət təcrübəsi.',
      description_ru: 'Премиум бренды и роскошные автомобили. Незабываемый опыт путешествия.',
      description_en: 'Premium brands and luxury cars. Unforgettable travel experience.',
      description_ar: 'العلامات التجارية المميزة والسيارات الفاخرة. تجربة سفر لا تُنسى.',
      image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600',
      category: 'luxury',
    },
    {
      title_az: 'Hava Limanı Transfer',
      title_ru: 'Трансфер из Аэропорта',
      title_en: 'Airport Transfer',
      title_ar: 'النقل من المطار',
      description_az: 'Hava limanından götürmə və qaytarma xidməti. Rahat və rahatlıq.',
      description_ru: 'Услуга встречи и возврата в аэропорт. Комфорт и удобство.',
      description_en: 'Pick-up and return service from airport. Comfort and convenience.',
      description_ar: 'خدمة الاستلام والإرجاع من المطار. الراحة والراحة.',
      image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600',
      category: 'airport',
    },
    {
      title_az: 'Şofer ilə İcarə',
      title_ru: 'Аренда с Водителем',
      title_en: 'Driver Service',
      title_ar: 'خدمة السائق',
      description_az: 'Peşəkar şofer ilə tam xidmət. Təhlükəsiz və stresssiz səyahət.',
      description_ru: 'Полный сервис с профессиональным водителем. Безопасное и безстрессовое путешествие.',
      description_en: 'Full service with professional driver. Safe and stress-free travel.',
      description_ar: 'خدمة كاملة مع سائق محترف. سفر آمن وخالٍ من الإجهاد.',
      image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600',
      category: 'driver',
    },
    {
      title_az: 'Şirkət İcarəsi',
      title_ru: 'Корпоративная Аренда',
      title_en: 'Corporate Rental',
      title_ar: 'الإيجار للشركات',
      description_az: 'Şirkətlər üçün xüsusi paketlər və qiymətlər. Korporativ müştərilər üçün.',
      description_ru: 'Специальные пакеты и цены для компаний. Для корпоративных клиентов.',
      description_en: 'Special packages and prices for companies. For corporate clients.',
      description_ar: 'حزم وأسعار خاصة للشركات. للعملاء المؤسسيين.',
      image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1600',
      category: 'rental',
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }
  console.log('✅ Services created');

  // Create blog posts
  const blogPosts = [
    {
      title_az: 'Bakıda Avtomobil İcarəsi: Tam Bələdçi',
      title_ru: 'Аренда Автомобилей в Баку: Полное Руководство',
      title_en: 'Car Rental in Baku: Complete Guide',
      title_ar: 'تأجير السيارات في باكو: دليل شامل',
      slug: 'baki-avtomobil-icare-tam-baledci',
      content_az: 'Bakıda avtomobil icarəsi haqqında tam bələdçi. Ən yaxşı avtomobil icarə şirkətləri, qiymətlər və məsləhətlər.',
      content_ru: 'Полное руководство по аренде автомобилей в Баку. Лучшие компании, цены и советы.',
      content_en: 'Complete guide to car rental in Baku. Best companies, prices and tips.',
      content_ar: 'دليل شامل لتأجير السيارات في باكو. أفضل الشركات والأسعار والنصائح.',
      excerpt_az: 'Bakıda avtomobil icarəsi üçün əlverişli seçimlər və tövsiyələr.',
      excerpt_ru: 'Удобные варианты и рекомендации по аренде автомобилей в Баку.',
      excerpt_en: 'Convenient options and recommendations for car rental in Baku.',
      excerpt_ar: 'خيارات مريحة وتوصيات لتأجير السيارات في باكو.',
      image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600',
      author: 'Admin',
      published: true,
      published_at: new Date(),
    },
    {
      title_az: 'Azərbaycanda Səyahət Etmək Üçün 10 Məsləhət',
      title_ru: '10 Советов для Путешествий по Азербайджану',
      title_en: '10 Tips for Traveling in Azerbaijan',
      title_ar: '10 نصائح للسفر في أذربيجان',
      slug: 'azerbaycanda-seyahet-etmek-ucun-10-meslehet',
      content_az: 'Azərbaycanda səyahət edərkən bilməli olduğunuz ən vacib məsləhətlər və tövsiyələr.',
      content_ru: 'Самые важные советы и рекомендации, которые нужно знать при путешествии по Азербайджану.',
      content_en: 'The most important tips and recommendations you need to know when traveling in Azerbaijan.',
      content_ar: 'أهم النصائح والتوصيات التي تحتاج إلى معرفتها عند السفر في أذربيجان.',
      excerpt_az: 'Səyahət planınızı hazırlayarkən bu məsləhətləri nəzərə alın.',
      excerpt_ru: 'Учтите эти советы при планировании поездки.',
      excerpt_en: 'Keep these tips in mind when planning your trip.',
      excerpt_ar: 'ضع هذه النصائح في الاعتبار عند التخطيط لرحلتك.',
      image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600',
      author: 'Admin',
      published: true,
      published_at: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log('✅ Blog posts created');

  // Create reviews
  const reviews = [
    {
      customer_name: 'Sara Mohamed',
      customer_location: 'Jakarta',
      rating: 5,
      title_az: 'Mükəmməl Xidmət',
      title_ru: 'Отличный Сервис',
      title_en: 'Excellent Service',
      title_ar: 'خدمة ممتازة',
      content_az: 'Diqqətə çox diqqət yetirildi və rezervasiya prosesi çox rahat idi. Bizim səyahətimizi unudulmaz etdi.',
      content_ru: 'Внимание к деталям в процессе бронирования сделало нашу поездку беззаботной.',
      content_en: 'Attention to detail in the booking process made our trip carefree.',
      content_ar: 'الاهتمام بالتفاصيل في عملية الحجز جعل رحلتنا خالية من المتاعب.',
      review_type: 'text',
      verified: true,
      featured: true,
    },
    {
      customer_name: 'Sophia Moore',
      customer_location: 'New York',
      rating: 5,
      title_az: 'Sürətli və Rahat',
      title_ru: 'Быстро и Удобно',
      title_en: 'Quick and Convenient',
      title_ar: 'سريع ومريح',
      content_az: 'Daha əvvəl bir çox avtomobil icarə platformasından istifadə etmişəm, amma bu sistem ən yaxşısıdır!',
      content_ru: 'Я использовал много платформ для аренды автомобилей, но эта система определенно лучшая!',
      content_en: 'I have used many car rental platforms before, but this system is definitely the best!',
      content_ar: 'لقد استخدمت العديد من منصات تأجير السيارات من قبل، لكن هذا النظام هو بالتأكيد الأفضل!',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      review_type: 'video',
      verified: true,
      featured: true,
    },
    {
      customer_name: 'Ali Rzayev',
      customer_location: 'Baku',
      rating: 5,
      title_az: 'Əla Kommunikasiya',
      title_ru: 'Отличное Общение',
      title_en: 'Excellent Communication',
      title_ar: 'تواصل ممتاز',
      content_az: 'Əla ünsiyyət və sürətli təhvil. Avtomobil təmiz və iqtisadi idi.',
      content_ru: 'Отличное общение и быстрая подача. Автомобиль был чистым и экономичным.',
      content_en: 'Excellent communication and quick delivery. The car was clean and economical.',
      content_ar: 'تواصل ممتاز وتسليم سريع. كانت السيارة نظيفة واقتصادية.',
      video_url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      review_type: 'video',
      verified: true,
      featured: true,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }
  console.log('✅ Reviews created');

  // Create sample reservations
  const allCars = await prisma.car.findMany();
  if (allCars.length > 0) {
    const reservations = [
      {
        car_id: allCars[0].id,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+994501234567',
        pickup_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        return_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        total_price: 165,
        status: 'confirmed',
      },
      {
        car_id: allCars[1].id,
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        customer_phone: '+994502345678',
        pickup_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        return_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        total_price: 595,
        status: 'pending',
      },
    ];

    for (const reservation of reservations) {
      await prisma.reservation.create({
        data: reservation,
      });
    }
    console.log('✅ Reservations created');
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

