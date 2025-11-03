import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
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
}

const FeaturedCars = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ekonomik');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

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
    return `${car.brand} ${car.model}`;
  };

  const categories = [
    { id: 'all', label: 'Hamısı' },
    { id: 'ekonomik', label: 'Ekonom' },
    { id: 'medium-sedan', label: 'Medium Sedan' },
    { id: 'biznes', label: 'Biznes' },
    { id: 'premium', label: 'Premium' },
    { id: 'suv', label: 'SUV' },
    { id: 'minivan', label: 'Minivan' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'big-bus', label: 'Big Bus' },
  ];

  const filteredCars = selectedCategory === 'all' 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-gradient-primary' : ''}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {filteredCars.map((car) => (
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
              
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {/* Gün */}
                  <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-white mb-1">gün</div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">{car.price_per_day}</span>
                      <span className="text-sm font-semibold text-white/90">AZN</span>
                    </div>
                  </div>
                  {/* Həftə */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900">{car.price_per_day * 7}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
                  </div>
                  {/* Ay */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-slate-900">{car.price_per_day * 30}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom button removed previously; keeping section minimal with prices only */}
      </div>
    </section>
  );
};

export default FeaturedCars;
