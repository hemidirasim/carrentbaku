import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { api, CategoryDto } from '@/lib/api';
import { resolveLocalizedValue } from '@/hooks/useContactInfo';

interface Car {
  id: string;
  brand: string;
  model: string;
  category: string;
  categories?: string[];
  image_url: string[] | string;
  price_per_day: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  seats: number;
  unavailable_dates?: string[] | null;
  fuel_type: string;
  available: boolean;
}

const INITIAL_VISIBLE_CARS = 12;

const FeaturedCars = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARS);

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll({ includeInactive: false, includeCounts: true });
        if (isMounted) {
          setCategories(Array.isArray(data) ? (data as CategoryDto[]) : []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) {
          setCategories([]);
        }
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await api.cars.getAll();
      // Filter only available cars
      const availableCars = (data || []).filter((car: Car) => car.available);
      setCars(availableCars);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  // Parse Vercel Blob response if it's JSON
  const parseImageUrl = (url: string | any): string => {
    if (typeof url === 'string') {
      try {
        const parsed = JSON.parse(url);
        return parsed.url || url;
      } catch {
        return url;
      }
    }
    if (url && typeof url === 'object' && url.url) {
      return url.url;
    }
    return url || '';
  };

  // Get first image from array or single image
  const getCarImage = (car: Car) => {
    if (Array.isArray(car.image_url)) {
      return car.image_url.length > 0 ? parseImageUrl(car.image_url[0]) : '';
    }
    return parseImageUrl(car.image_url || '');
  };

  const getCarName = (car: Car) => {
    const yearLabel = car.year ? ` (${car.year})` : '';
    return `${car.brand} ${car.model}${yearLabel}`;
  };

  const activeCategories = useMemo(() => {
    return categories
      .filter(category => category?.is_active)
      .sort((a, b) => {
        if ((a?.sort_order ?? 0) !== (b?.sort_order ?? 0)) {
          return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
        }
        const labelA = resolveLocalizedValue(a.name, language);
        const labelB = resolveLocalizedValue(b.name, language);
        return labelA.localeCompare(labelB);
      });
  }, [categories, language]);

  const availableCategorySlugs = useMemo(() => activeCategories.map(category => category.slug), [activeCategories]);

  const categoryOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    activeCategories.forEach((category, index) => {
      map.set(category.slug, index);
    });
    return map;
  }, [activeCategories]);

  const getCategoryLabel = (category: CategoryDto) => {
    const label = resolveLocalizedValue(category.name, language);
    if (label && label.trim().length > 0) {
      return label;
    }
    return category.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const allLabel = t('cars.filter.all');

  const handleSelectAll = () => {
    setSelectedCategory(null);
  };

  const handleToggleCategory = (categoryId: string) => {
    if (!availableCategorySlugs.includes(categoryId)) {
      return;
    }
    setSelectedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  useEffect(() => {
    if (selectedCategory === null) {
      setVisibleCount(INITIAL_VISIBLE_CARS);
    }
  }, [selectedCategory]);

  const getCarCategories = (car: Car): string[] => {
    if (Array.isArray((car as any).categories) && (car as any).categories.length > 0) {
      return (car as any).categories.filter((category: unknown): category is string => typeof category === 'string' && category.trim() !== '');
    }
    return car.category ? [car.category] : [];
  };

  const getPrimaryCategoryOrder = (car: Car): number => {
    const carCategories = getCarCategories(car);
    const orders = carCategories
      .map(category => categoryOrderMap.get(category))
      .filter((value): value is number => typeof value === 'number');
    if (orders.length > 0) {
      return Math.min(...orders);
    }
    return Number.MAX_SAFE_INTEGER;
  };

  const isAllSelected = selectedCategory === null;

  const filteredCars = useMemo(() => {
    const base = isAllSelected
      ? cars
      : cars.filter(car => {
          const carCategories = getCarCategories(car);
          return selectedCategory ? carCategories.includes(selectedCategory) : true;
        });

    if (isAllSelected) {
      return [...base].sort((a, b) => getPrimaryCategoryOrder(a) - getPrimaryCategoryOrder(b));
    }

    return base;
  }, [cars, isAllSelected, selectedCategory, categoryOrderMap]);

  const displayedCars = isAllSelected ? filteredCars.slice(0, visibleCount) : filteredCars;
  const canLoadMore = isAllSelected && visibleCount < filteredCars.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + INITIAL_VISIBLE_CARS, filteredCars.length));
  };

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: 'aliceblue' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: 'aliceblue' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start text-left mb-12 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {t('cars.comprehensive.title.part1')} <span className="text-accent">{t('cars.comprehensive.title.part2')}</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('cars.comprehensive.subtitle')}
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              className={`rounded-full border transition ${isAllSelected ? 'bg-gradient-primary text-white border-transparent shadow-lg' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
              onClick={handleSelectAll}
            >
              {allLabel !== 'cars.filter.all' ? allLabel : t('cars.filter.all')}
            </Button>
            {activeCategories.map(category => {
              const selected = selectedCategory === category.slug;
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  className={`rounded-full border transition ${selected ? 'bg-gradient-primary text-white border-transparent shadow-lg' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
                  onClick={() => handleToggleCategory(category.slug)}
                >
                  {getCategoryLabel(category)}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {displayedCars.map((car) => (
            <Card 
              key={car.id}
              className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/cars/${car.id}`)}
            >
              <div className="relative w-full" style={{ aspectRatio: '16 / 9', minHeight: '220px' }}>
                <img 
                  src={getCarImage(car) || '/placeholder.svg'} 
                  alt={getCarName(car)}
                  className="w-full h-full object-cover"
                />
                {/* bottom gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                {/* car name overlay */}
                <div className="absolute left-3 bottom-3">
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow">{getCarName(car)}</span>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {/* Gün */}
                  <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-white mb-1">{t('services.detail.price.perDay')}</div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">{car.price_per_day}</span>
                      <span className="text-sm font-semibold text-white/90">AZN</span>
                    </div>
                  </div>
                  {/* Həftə */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">{t('services.detail.price.perWeek')}</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900">{car.price_per_week || car.price_per_day * 7}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
                  </div>
                  {/* Ay */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">{t('services.detail.price.perMonth')}</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-slate-900">{car.price_per_month || car.price_per_day * 30}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-gradient-primary text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/reserve?carId=${car.id}`);
                  }}
                >
                  {t('nav.reserve')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {canLoadMore && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleLoadMore}>
              {t('cars.loadMore')}
            </Button>
          </div>
        )}

        {/* Bottom button removed previously; keeping section minimal with prices only */}
      </div>
    </section>
  );
};

export default FeaturedCars;
