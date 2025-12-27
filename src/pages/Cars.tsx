import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api, CategoryDto } from '@/lib/api';
import { resolveLocalizedValue } from '@/hooks/useContactInfo';
import { normalizeImageUrl } from '@/lib/utils';

const INITIAL_VISIBLE_CARS = 12;

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
  year: number;
}

const Cars = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickupFilter, setPickupFilter] = useState<string | null>(null);
  const [dropoffFilter, setDropoffFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CARS);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll({ includeInactive: false, includeCounts: true });
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
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

  // URL-dən category parametrini oxu
  const activeCategories = useMemo(() => {
    return categories
      .filter(category => category?.is_active)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        const labelA = resolveLocalizedValue(a.name, language);
        const labelB = resolveLocalizedValue(b.name, language);
        return labelA.localeCompare(labelB);
      });
  }, [categories, language]);

  const availableCategorySlugs = useMemo(
    () => activeCategories.map(category => category.slug),
    [activeCategories],
  );

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && availableCategorySlugs.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory(null);
    }
  }, [location.search, availableCategorySlugs]);

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const sanitizeDateParam = (value: string | null): string | null => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
  };

  const loadCars = async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const pickupParam = sanitizeDateParam(searchParams.get('pickup'));
      const dropoffParam = sanitizeDateParam(searchParams.get('dropoff'));
      setPickupFilter(pickupParam);
      setDropoffFilter(dropoffParam);

      const data = await api.cars.getAll({
        pickup: pickupParam ?? undefined,
        dropoff: dropoffParam ?? undefined,
      });
      const availableCars = (data || []).filter((car: Car) => car.available);
      setCars(availableCars);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryQuery = (selection: string | null) => {
    const searchParams = new URLSearchParams(location.search);
    if (!selection) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', selection);
    }
    const newSearch = searchParams.toString();
    navigate(`/cars${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  const handleSelectAll = () => {
    setSelectedCategory(null);
    updateCategoryQuery(null);
  };

  const handleToggleCategory = (categoryId: string) => {
    if (!availableCategorySlugs.includes(categoryId)) {
      return;
    }
    setSelectedCategory(prev => {
      const next = prev === categoryId ? null : categoryId;
      updateCategoryQuery(next);
      return next;
    });
  };

  const handleClearDateFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('pickup');
    searchParams.delete('dropoff');
    const newSearch = searchParams.toString();
    navigate(`/cars${newSearch ? `?${newSearch}` : ''}`, { replace: true });
  };

  // Get images array from car
  const getCarImages = (car: Car): string[] => {
    if (Array.isArray(car.image_url)) {
      return car.image_url.map(url => normalizeImageUrl(url)).filter(url => url);
    }
    const singleImage = normalizeImageUrl(car.image_url || '');
    return singleImage ? [singleImage] : [];
  };

  const getCarName = (car: Car) => {
    const yearLabel = car.year ? ` (${car.year})` : '';
    return `${car.brand} ${car.model}${yearLabel}`;
  };

  const getCarCategories = (car: Car): string[] => {
    if (Array.isArray((car as any).categories) && (car as any).categories.length > 0) {
      return (car as any).categories.filter((category: unknown): category is string => typeof category === 'string' && category.trim() !== '');
    }
    return car.category ? [car.category] : [];
  };

  const getPrimaryCategoryOrder = (car: Car): number => {
    const orders = getCarCategories(car)
      .map(category => categoryOrderMap.get(category))
      .filter((value): value is number => typeof value === 'number');
    if (orders.length > 0) {
      return Math.min(...orders);
    }
    return Number.MAX_SAFE_INTEGER;
  };

  const isAllSelected = selectedCategory === null;

  useEffect(() => {
    if (isAllSelected) {
      setVisibleCount(INITIAL_VISIBLE_CARS);
    }
  }, [isAllSelected, pickupFilter, dropoffFilter]);

  const filteredCars = useMemo(() => {
    const base = selectedCategory
      ? cars.filter(car => getCarCategories(car).includes(selectedCategory))
      : cars;

    if (base.length === 0) {
      return base;
    }

    if (!selectedCategory) {
      return [...base].sort((a, b) => getPrimaryCategoryOrder(a) - getPrimaryCategoryOrder(b));
    }

    return base;
  }, [cars, selectedCategory, categoryOrderMap]);

  const displayedCars = isAllSelected ? filteredCars.slice(0, visibleCount) : filteredCars;
  const canLoadMore = isAllSelected && visibleCount < filteredCars.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + INITIAL_VISIBLE_CARS, filteredCars.length));
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('nav.cars')}
          </h1>
          <p className="text-white/90 text-center text-lg">
            {t('cars.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Category Filter - Ana səhifə stili */}
          <div className="mb-8">
            {/* Category buttons - həmişə görünür */}
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
            {(pickupFilter || dropoffFilter) && (
              <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                <span>
                  Tarix aralığı: {pickupFilter}
                  {dropoffFilter && dropoffFilter !== pickupFilter ? ` → ${dropoffFilter}` : ''}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={handleClearDateFilters}>
                  {t('cars.search.resetDates')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
          {filteredCars.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredCars.length}</span> {t('cars.found')}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => (
              <Card 
                key={car.id}
                className="group overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                {/* Image Gallery with Swipe Slider */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', minHeight: '280px' }}>
                  {/* Swipe Slider for Images */}
                  {(() => {
                    const images = getCarImages(car);
                    return images.length > 0 ? (
                    <Carousel
                      className="w-full h-full"
                      opts={{
                        align: 'start',
                        loop: true,
                        dragFree: true,
                      }}
                    >
                      <CarouselContent className="h-full">
                          {images.map((image, index) => (
                          <CarouselItem key={index} className="h-full pl-0">
                              <img 
                                src={image} 
                                alt={`${getCarName(car)} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  ) : (
                    <img 
                        src="/placeholder.svg" 
                        alt={getCarName(car)}
                        className="w-full h-full object-cover"
                      />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <CardContent className="pt-6 space-y-6">
                  <h3 className="text-xl font-bold">{getCarName(car)}</h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {/* Gün */}
                    <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-white mb-1">{t('services.detail.price.perDay')}</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold text-white">{car.price_per_day}</span>
                        <span className="text-xs font-semibold text-white/90">AZN</span>
                      </div>
                    </div>
                    {/* Həftə */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">{t('services.detail.price.perWeek')}</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-bold text-slate-900">{car.price_per_week || car.price_per_day * 7}</span>
                        <span className="text-xs font-semibold text-slate-700">AZN</span>
                      </div>
                    </div>
                    {/* Ay */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">{t('services.detail.price.perMonth')}</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-extrabold text-slate-900">{car.price_per_month || car.price_per_day * 30}</span>
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
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={handleLoadMore}>
                {t('cars.loadMore')}
              </Button>
            </div>
          )}

          {filteredCars.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-muted rounded-full mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">{t('cars.search.noResults')}</p>
              <p className="text-muted-foreground mb-6">
                {t('cars.search.adjustFilters')}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleSelectAll}>
                  {t('cars.search.resetCategories')}
                </Button>
                {(pickupFilter || dropoffFilter) && (
                  <Button variant="outline" onClick={handleClearDateFilters}>
                    {t('cars.search.resetDates')}
                  </Button>
                )}
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cars;