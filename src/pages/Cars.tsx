import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';

interface Car {
  id: string;
  brand: string;
  model: string;
  category: string;
  image_url: string[] | string;
  price_per_day: number;
  seats: number;
  fuel_type: string;
  available: boolean;
  year: number;
}

const Cars = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // URL-dən category parametrini oxu
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [location.search]);

  useEffect(() => {
    loadCars();
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

  // Category dəyişəndə URL-i yenilə
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const searchParams = new URLSearchParams(location.search);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    const newSearch = searchParams.toString();
    navigate(`/cars${newSearch ? `?${newSearch}` : ''}`, { replace: true });
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

  // Get images array from car
  const getCarImages = (car: Car): string[] => {
    if (Array.isArray(car.image_url)) {
      return car.image_url.map(url => parseImageUrl(url)).filter(url => url);
    }
    const singleImage = parseImageUrl(car.image_url || '');
    return singleImage ? [singleImage] : [];
  };

  const getCarName = (car: Car) => {
    return `${car.brand} ${car.model}`;
  };

  const filteredCars = selectedCategory === 'all' 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('nav.cars')}
          </h1>
          <p className="text-white/90 text-center text-lg">
            Sürüş azadlığını yaşayın-avtomobilinizi indi seçin
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
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('all')}
                className={selectedCategory === 'all' ? 'bg-gradient-primary' : ''}
              >
                Hamısı
              </Button>
              <Button
                variant={selectedCategory === 'ekonomik' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('ekonomik')}
                className={selectedCategory === 'ekonomik' ? 'bg-gradient-primary' : ''}
              >
                Ekonom
              </Button>
              <Button
                variant={selectedCategory === 'medium-sedan' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('medium-sedan')}
                className={selectedCategory === 'medium-sedan' ? 'bg-gradient-primary' : ''}
              >
                Medium Sedan
              </Button>
              <Button
                variant={selectedCategory === 'biznes' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('biznes')}
                className={selectedCategory === 'biznes' ? 'bg-gradient-primary' : ''}
              >
                Biznes
              </Button>
              <Button
                variant={selectedCategory === 'premium' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('premium')}
                className={selectedCategory === 'premium' ? 'bg-gradient-primary' : ''}
              >
                Premium
              </Button>
              <Button
                variant={selectedCategory === 'suv' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('suv')}
                className={selectedCategory === 'suv' ? 'bg-gradient-primary' : ''}
              >
                SUV
              </Button>
              <Button
                variant={selectedCategory === 'minivan' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('minivan')}
                className={selectedCategory === 'minivan' ? 'bg-gradient-primary' : ''}
              >
                Minivan
              </Button>
            <Button 
                variant={selectedCategory === 'luxury' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('luxury')}
                className={selectedCategory === 'luxury' ? 'bg-gradient-primary' : ''}
              >
                Luxury
            </Button>
              <Button
                variant={selectedCategory === 'big-bus' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('big-bus')}
                className={selectedCategory === 'big-bus' ? 'bg-gradient-primary' : ''}
              >
                Big Bus
              </Button>
            </div>
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
                <span className="font-semibold text-foreground">{filteredCars.length}</span> avtomobil tapıldı
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
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
                
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-6">{getCarName(car)}</h3>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {/* Gün */}
                    <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-white mb-1">gün</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold text-white">{car.price_per_day}</span>
                        <span className="text-xs font-semibold text-white/90">AZN</span>
                      </div>
                    </div>
                    {/* Həftə */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-bold text-slate-900">{car.price_per_day * 7}</span>
                        <span className="text-xs font-semibold text-slate-700">AZN</span>
                      </div>
                    </div>
                    {/* Ay */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-extrabold text-slate-900">{car.price_per_day * 30}</span>
                        <span className="text-xs font-semibold text-slate-700">AZN</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCars.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-muted rounded-full mb-4">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">Nəticə tapılmadı</p>
              <p className="text-muted-foreground mb-6">
                Filterləri dəyişdirərək yenidən axtarış edin
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  handleCategoryChange('all');
                }}
              >
                {t('cars.reset')}
              </Button>
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