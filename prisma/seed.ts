import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

interface CategorySeed {
  slug: string;
  sortOrder: number;
  isActive?: boolean;
  name: {
    az: string;
    ru?: string;
    en?: string;
    ar?: string;
  };
}

async function seedCategories(categories: CategorySeed[]) {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name_az: category.name.az,
        name_ru: category.name.ru ?? null,
        name_en: category.name.en ?? null,
        name_ar: category.name.ar ?? null,
        sort_order: category.sortOrder,
        is_active: category.isActive ?? true,
      },
      create: {
        slug: category.slug,
        name_az: category.name.az,
        name_ru: category.name.ru ?? null,
        name_en: category.name.en ?? null,
        name_ar: category.name.ar ?? null,
        sort_order: category.sortOrder,
        is_active: category.isActive ?? true,
      },
    });
  }
}

async function seedCars() {
  const cars = [
    {
      brand: "Hyundai",
      model: "Elantra",
      year: 2023,
      category: "econom",
      categories: ["econom"],
      price_per_day: 55,
      price_per_week: 360,
      price_per_month: 1400,
      fuel_type: "Petrol",
      transmission: "Automatic",
      seats: 5,
      image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000",
      features: ["Bluetooth", "Air Conditioning", "GPS Navigation"],
      available: true,
    },
    {
      brand: "Toyota",
      model: "Camry",
      year: 2023,
      category: "medium-sedan",
      categories: ["medium-sedan"],
      price_per_day: 85,
      price_per_week: 520,
      price_per_month: 1800,
      fuel_type: "Hybrid",
      transmission: "Automatic",
      seats: 5,
      image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000",
      features: ["Bluetooth", "Sunroof", "Air Conditioning", "GPS Navigation"],
      available: true,
    },
    {
      brand: "Mercedes",
      model: "E-Class",
      year: 2024,
      category: "luxury",
      categories: ["luxury"],
      price_per_day: 150,
      price_per_week: 980,
      price_per_month: 3200,
      fuel_type: "Diesel",
      transmission: "Automatic",
      seats: 5,
      image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000",
      features: ["Sport Package", "Premium Sound", "Adaptive Cruise", "Lane Assist"],
      available: true,
    },
    {
      brand: "BMW",
      model: "5 Series",
      year: 2024,
      category: "luxury",
      categories: ["luxury"],
      price_per_day: 180,
      price_per_week: 1150,
      price_per_month: 3600,
      fuel_type: "Diesel",
      transmission: "Automatic",
      seats: 5,
      image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000",
      features: ["Sport Package", "Premium Sound", "Adaptive Cruise", "Parking Assistant"],
      available: true,
    },
    {
      brand: "Toyota",
      model: "Land Cruiser",
      year: 2024,
      category: "suv",
      categories: ["suv"],
      price_per_day: 200,
      price_per_week: 1280,
      price_per_month: 4200,
      fuel_type: "Diesel",
      transmission: "Automatic",
      seats: 7,
      image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
      features: ["4WD", "Premium Sound", "Sunroof", "GPS Navigation"],
      available: true,
    },
    {
      brand: "Mercedes",
      model: "V-Class",
      year: 2023,
      category: "minivan",
      categories: ["minivan"],
      price_per_day: 180,
      price_per_week: 1120,
      price_per_month: 3800,
      fuel_type: "Diesel",
      transmission: "Automatic",
      seats: 8,
      image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000",
      features: ["Bluetooth", "Air Conditioning", "GPS Navigation", "Rear Entertainment"],
      available: true,
    },
    {
      brand: "Isuzu",
      model: "Turquoise",
      year: 2022,
      category: "big-bus",
      categories: ["big-bus"],
      price_per_day: 320,
      price_per_week: 2100,
      price_per_month: 6400,
      fuel_type: "Diesel",
      transmission: "Automatic",
      seats: 30,
      image_url: "https://images.unsplash.com/photo-1532879311111-1ea98c6496d0?q=80&w=1200",
      features: ["Climate Control", "USB Charging", "Reclining Seats"],
      available: true,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: car,
    });
  }
}


async function seedAgentConfig() {
  const defaultInstructions = `Müştərilərə CARRENTBAKU xidmətləri barədə səmimi, peşəkar və qısa cavablar ver.

Rezervasiya üçün müştərinin adı, əlaqə nömrəsi və istək tarixlərini soruş.

Mümkün olduqda saytımızın əlaqə forması və ya telefon nömrəsi ilə əlaqə yaradırıq.`;

  const config = {
    agent_name: 'midiya-ai-chat',
    api_token: 'nOu7AOrXflnIZbzt9Fc4gh0IJ_R2qFNc',
    instructions: defaultInstructions.trim(),
    company_name: 'CARRENTBAKU',
    site_url: 'https://new.carrentbaku.az',
    agent_endpoint: 'https://xwwxqujbyxojtvb5qzrflqgu.agents.do-ai.run',
    project_id: '11f0c06e-45d7-a6fc-b074-4e013e2ddde4',
    database_id: '0bbb8d8a-f88e-4686-87b4-c1050783ae86',
    knowledge_base_id: '14cffe65-c07a-11f0-b074-4e013e2ddde4',
    embedding_model_id: '18bc9b8f-73c5-11f0-b074-4e013e2ddde4',
  };

  const existing = await prisma.agentConfig.findFirst();
  if (existing) {
    await prisma.agentConfig.update({
      where: { id: existing.id },
      data: config,
    });
  } else {
    await prisma.agentConfig.create({
      data: { id: randomUUID(), ...config },
    });
  }
}

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@carrentbaku.az" },
    update: {},
    create: {
      email: "admin@carrentbaku.az",
      password_hash: hashedPassword,
      name: "Admin User",
      roles: {
        create: { role: "admin" },
      },
    },
  });
  console.log("✅ Admin user ready");

  await seedAgentConfig();
  console.log("🤖 Agent config ready");

  const categories: CategorySeed[] = [
    {
      slug: "econom",
      sortOrder: 10,
      name: {
        az: "Econom",
        ru: "Эконом",
        en: "Econom",
        ar: "اقتصاد",
      },
    },
    {
      slug: "medium-sedan",
      sortOrder: 20,
      name: {
        az: "Medium Sedan",
        ru: "Средний Седан",
        en: "Medium Sedan",
        ar: "سيدان متوسط",
      },
    },
    {
      slug: "suv",
      sortOrder: 30,
      name: {
        az: "SUV",
        ru: "SUV",
        en: "SUV",
        ar: "دفع رباعي",
      },
    },
    {
      slug: "luxury",
      sortOrder: 40,
      name: {
        az: "Luxury",
        ru: "Люкс",
        en: "Luxury",
        ar: "فاخر",
      },
    },
    {
      slug: "minivan",
      sortOrder: 50,
      name: {
        az: "Minivan",
        ru: "Минивэн",
        en: "Minivan",
        ar: "ميني فان",
      },
    },
    {
      slug: "big-bus",
      sortOrder: 60,
      name: {
        az: "Big Bus",
        ru: "Большой Автобус",
        en: "Big Bus",
        ar: "حافلة كبيرة",
      },
    },
  ];

  await seedCategories(categories);
  console.log("✅ Categories ready");

  await seedCars();
  console.log("✅ Cars created");

  const services = [
    {
      title_az: "Günlük və Həftəlik İcarə",
      title_ru: "Ежедневная и Еженедельная Аренда",
      title_en: "Daily and Weekly Rental",
      title_ar: "الإيجار اليومي والأسبوعي",
      description_az: "Qısa müddətli səyahətlər üçün ideal. Minimum 1 gün, maksimum həftəlik icarə seçimləri.",
      description_ru: "Идеально для краткосрочных поездок. Минимум 1 день, максимум недельная аренда.",
      description_en: "Perfect for short-term trips. Minimum 1 day, maximum weekly rental options.",
      description_ar: "مثالي للرحلات قصيرة المدى. الحد الأدنى يوم واحد، خيارات الإيجار الأسبوعي بحد أقصى.",
      image_url: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600",
      category: "daily-weekly",
    },
    {
      title_az: "Uzun Müddətli İcarə",
      title_ru: "Долгосрочная Аренда",
      title_en: "Long Term Rental",
      title_ar: "الإيجار طويل الأمد",
      description_az: "Bir ay və ya daha uzun müddətə xüsusi qiymətlər. Ən yaxşı qiymət təklifləri.",
      description_ru: "Специальные цены на месяц или дольше. Лучшие предложения.",
      description_en: "Special rates for a month or longer. Best price offers.",
      description_ar: "أسعار خاصة لمدة شهر أو أطول. أفضل عروض الأسعار.",
      image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600",
      category: "long-term",
    },
    {
      title_az: "Lüks Avtomobillər",
      title_ru: "Люксовые Автомобили",
      title_en: "Luxury Cars",
      title_ar: "سيارات فاخرة",
      description_az: "Premium markalar və lüks avtomobillər. Unudulmaz səyahət təcrübəsi.",
      description_ru: "Премиум бренды и роскошные автомобили. Незабываемый опыт путешествия.",
      description_en: "Premium brands and luxury cars. Unforgettable travel experience.",
      description_ar: "العلامات التجارية المميزة والسيارات الفاخرة. تجربة سفر لا تُنسى.",
      image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600",
      category: "luxury",
    },
    {
      title_az: "Hava Limanı Transfer",
      title_ru: "Трансфер из Аэропорта",
      title_en: "Airport Transfer",
      title_ar: "النقل من المطار",
      description_az: "Hava limanından götürmə və qaytarma xidməti. Rahat və rahatlıq.",
      description_ru: "Услуга встречи и возврата в аэропорт. Комфорт и удобство.",
      description_en: "Pick-up and return service from airport. Comfort and convenience.",
      description_ar: "خدمة الاستلام والإرجاع من المطار. الراحة والراحة.",
      image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600",
      category: "airport",
    },
    {
      title_az: "Şofer ilə İcarə",
      title_ru: "Аренда с Водителем",
      title_en: "Driver Service",
      title_ar: "خدمة السائق",
      description_az: "Peşəkar şofer ilə tam xidmət. Təhlükəsiz və stresssiz səyahət.",
      description_ru: "Полный сервис с профессиональным водителем. Безопасное и безстрессовое путешествие.",
      description_en: "Full service with professional driver. Safe and stress-free travel.",
      description_ar: "خدمة كاملة مع سائق محترف. سفر آمن وخالٍ من الإجهاد.",
      image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600",
      category: "driver",
    },
    {
      title_az: "Şirkət İcarəsi",
      title_ru: "Корпоративная Аренда",
      title_en: "Corporate Rental",
      title_ar: "الإيجار للشركات",
      description_az: "Şirkətlər üçün xüsusi paketlər və qiymətlər. Korporativ müştərilər üçün.",
      description_ru: "Специальные пакеты и цены для компаний. Для корпоративных клиентов.",
      description_en: "Special packages and prices for companies. For corporate clients.",
      description_ar: "حزم وأسعار خاصة للشركات. للعملاء المؤسسيين.",
      image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1600",
      category: "corporate",
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log("✅ Services created");

  const blogPosts = [
    {
      title_az: "Bakıda Avtomobil İcarəsi: Tam Bələdçi",
      title_ru: "Аренда Автомобилей в Баку: Полное Руководство",
      title_en: "Car Rental in Baku: Complete Guide",
      title_ar: "تأجير السيارات في باكو: دليل شامل",
      slug: "baki-avtomobil-icare-tam-baledci",
      content_az: "Bakıda avtomobil icarəsi haqqında tam bələdçi. Ən yaxşı avtomobil icarə şirkətləri, qiymətlər və məsləhətlər.",
      content_ru: "Полное руководство по аренде автомобилей в Баку. Лучшие компании, цены и советы.",
      content_en: "Complete guide to car rental in Baku. Best companies, prices and tips.",
      content_ar: "دليل شامل لتأجير السيارات في باكو. أفضل الشركات والأسعار والنصائح.",
      excerpt_az: "Bakıda avtomobil icarəsi üçün əlverişli seçimlər və tövsiyələr.",
      excerpt_ru: "Удобные варианты и рекомендации по аренде автомобилей в Баку.",
      excerpt_en: "Convenient options and recommendations for car rental in Baku.",
      excerpt_ar: "خيارات مريحة وتوصيات لتأجير السيارات في باكو.",
      image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600",
      author: "Admin",
      category: 'news',
      published: true,
      published_at: new Date(),
    },
    {
      title_az: "SUV Avtomobil icarəsi üçün 5 səbəb",
      title_ru: "5 причин арендовать SUV",
      title_en: "5 Reasons to Rent an SUV",
      title_ar: "5 أسباب لاستئجار سيارة دفع رباعي",
      slug: "suv-avtomobil-icare-ucun-5-sebeb",
      content_az: "SUV avtomobillərin üstünlükləri haqqında məqalə.",
      content_ru: "Статья о преимуществах SUV автомобилей.",
      content_en: "Article about the benefits of SUV vehicles.",
      content_ar: "مقال عن مزايا سيارات الدفع الرباعي.",
      excerpt_az: "SUV avtomobil icarə etmək üçün əsas səbəblər.",
      excerpt_ru: "Основные причины арендовать SUV.",
      excerpt_en: "Key reasons to rent an SUV.",
      excerpt_ar: "أهم الأسباب لاستئجار سيارة دفع رباعي.",
      image_url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1600",
      author: "Admin",
      category: 'blogs',
      published: true,
      published_at: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log("✅ Blog posts created");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🚀 Seeding finished");
  });
