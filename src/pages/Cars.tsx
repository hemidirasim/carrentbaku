import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Fuel, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Cars = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const cars = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
      price: 55,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 2,
      name: 'Toyota Camry',
      category: 'comfort',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
      price: 85,
      seats: 5,
      fuel: 'Hybrid',
      year: 2023,
    },
    {
      id: 3,
      name: 'Mercedes E-Class',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
      price: 150,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 4,
      name: 'Kia Rio',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
      price: 50,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 5,
      name: 'BMW 5 Series',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      price: 180,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 6,
      name: 'Honda Accord',
      category: 'comfort',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      price: 80,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 7,
      name: 'Nissan Sentra',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000',
      price: 60,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 8,
      name: 'Audi A6',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000',
      price: 170,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
  ];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;
    const matchesPrice = 
      priceRange === 'all' ||
      (priceRange === 'low' && car.price < 70) ||
      (priceRange === 'medium' && car.price >= 70 && car.price < 120) ||
      (priceRange === 'high' && car.price >= 120);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('nav.cars')}
          </h1>
          <p className="text-white/90 text-center text-lg">
            Geniş avtomobil parkımızdan seçim edin
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Avtomobil axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kateqoriya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('cars.filter.all')}</SelectItem>
                <SelectItem value="economy">{t('cars.filter.economy')}</SelectItem>
                <SelectItem value="comfort">{t('cars.filter.comfort')}</SelectItem>
                <SelectItem value="premium">{t('cars.filter.premium')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Qiymət aralığı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün qiymətlər</SelectItem>
                <SelectItem value="low">0-70 AZN</SelectItem>
                <SelectItem value="medium">70-120 AZN</SelectItem>
                <SelectItem value="high">120+ AZN</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset */}
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
            >
              Sıfırla
            </Button>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card 
                key={car.id}
                className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge 
                    className="absolute top-4 right-4 bg-accent text-accent-foreground"
                  >
                    {car.year}
                  </Badge>
                </div>
                
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{car.seats} nəfər</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-primary">{car.price}</span>
                    <span className="text-muted-foreground">AZN / {t('cars.perDay')}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full bg-gradient-primary group">
                    {t('nav.reserve')}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Axtarış nəticəsində avtomobil tapılmadı</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cars;
