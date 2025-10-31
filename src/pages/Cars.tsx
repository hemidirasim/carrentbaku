import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Users, Fuel, ArrowRight, Search, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { carBrands } from '@/data/carBrands';

const Cars = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  const cars = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'ekonomik',
      brand: 'Hyundai',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
      price: 55,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 2,
      name: 'Toyota Camry',
      category: 'biznes',
      brand: 'Toyota',
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
      brand: 'Mercedes-Benz',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
      price: 150,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 4,
      name: 'Kia Rio',
      category: 'ekonomik',
      brand: 'Kia',
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
      brand: 'BMW',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      price: 180,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 6,
      name: 'Honda Accord',
      category: 'biznes',
      brand: 'Honda',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      price: 80,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
    },
    {
      id: 7,
      name: 'Nissan Sentra',
      category: 'ekonomik',
      brand: 'Nissan',
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
      brand: 'Audi',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000',
      price: 170,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 9,
      name: 'Toyota Land Cruiser',
      category: 'suv',
      brand: 'Toyota',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000',
      price: 200,
      seats: 7,
      fuel: 'Diesel',
      year: 2024,
    },
    {
      id: 10,
      name: 'Mercedes-Benz V-Class',
      category: 'minivan',
      brand: 'Mercedes-Benz',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000',
      price: 180,
      seats: 8,
      fuel: 'Diesel',
      year: 2023,
    },
  ];

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || car.brand.toLowerCase().replace('-', '') === selectedBrand.toLowerCase().replace('-', '');
    const matchesPrice = 
      priceRange === 'all' ||
      (priceRange === 'low' && car.price < 70) ||
      (priceRange === 'medium' && car.price >= 70 && car.price < 120) ||
      (priceRange === 'high' && car.price >= 120);
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
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
            {t('cars.header')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Filterlər</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('cars.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('cars.filter.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('cars.filter.all')}</SelectItem>
                  <SelectItem value="ekonomik">{t('cars.filter.ekonomik')}</SelectItem>
                  <SelectItem value="biznes">{t('cars.filter.biznes')}</SelectItem>
                  <SelectItem value="premium">{t('cars.filter.premium')}</SelectItem>
                  <SelectItem value="suv">{t('cars.filter.suv')}</SelectItem>
                  <SelectItem value="minivan">{t('cars.filter.minivan')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('cars.price')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('cars.price.all')}</SelectItem>
                  <SelectItem value="low">0-70 AZN</SelectItem>
                  <SelectItem value="medium">70-120 AZN</SelectItem>
                  <SelectItem value="high">120+ AZN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* Brand Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Brend:</span>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('cars.filter.brand')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('cars.filter.all')}</SelectItem>
                    {carBrands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || priceRange !== 'all') && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceRange('all');
                  }}
                >
                  {t('cars.reset')}
                </Button>
              )}
            </div>
          </div>

          {/* Brand Logos */}
          <Collapsible open={isBrandsOpen} onOpenChange={setIsBrandsOpen}>
            <CollapsibleTrigger asChild>
              <button className="pt-6 w-full flex items-center justify-between border-t border-border">
                <p className="text-sm text-muted-foreground font-medium">Brend seçin:</p>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="flex flex-wrap justify-start gap-3">
                {carBrands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`p-3 bg-background rounded-lg border-2 transition-all hover:shadow-elegant ${
                      selectedBrand === brand.id 
                        ? 'border-primary shadow-glow bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className={`h-8 w-auto transition-all ${
                        selectedBrand === brand.id ? 'grayscale-0' : 'grayscale hover:grayscale-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
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
                className="group overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', minHeight: '280px' }}>
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge 
                    className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-lg"
                  >
                    {car.year}
                  </Badge>
                </div>
                
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{car.seats} nəfər</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4" />
                      <span>{car.fuel}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {/* Gün */}
                    <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-white mb-1">gün</div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg md:text-xl font-bold text-white">{car.price}</span>
                        <span className="text-xs font-semibold text-white/90">AZN</span>
                      </div>
                    </div>
                    {/* Həftə */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-bold text-slate-900">{car.price * 7}</span>
                        <span className="text-xs font-semibold text-slate-700">AZN</span>
                      </div>
                    </div>
                    {/* Ay */}
                    <div className="rounded-lg p-3 text-center border border-border">
                      <div className="text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                      <div className="flex flex-col items-center">
                        <span className="text-base md:text-lg font-extrabold text-slate-900">{car.price * 30}</span>
                        <span className="text-xs font-semibold text-slate-700">AZN</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-gradient-primary group"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    {t('cars.viewDetails')}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredCars.length === 0 && (
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
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setPriceRange('all');
                }}
              >
                {t('cars.reset')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cars;
