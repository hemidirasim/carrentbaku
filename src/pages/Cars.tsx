import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Cars = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Fancybox-i init et (CDN-dən yüklə)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // CDN-dən Fancybox yüklə
    const loadFancybox = () => {
      // CSS yüklə
      if (!document.querySelector('link[href*="fancybox"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
        document.head.appendChild(link);
      }

      // Script yüklə
      if (!(window as any).Fancybox) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
        script.async = true;
        script.onload = () => {
          const Fancybox = (window as any).Fancybox;
          if (Fancybox) {
            Fancybox.bind("[data-fancybox]", {
              Toolbar: {
                display: {
                  left: ["infobar"],
                  middle: [],
                  right: ["slideshow", "download", "thumbs", "close"],
                },
              },
              Thumbs: {
                autoStart: false,
              },
              Image: {
                zoom: true,
              },
              Swipe: {
                threshold: 50,
              },
            });
          }
        };
        document.head.appendChild(script);
      } else {
        // Əgər artıq yüklənibsə, dərhal bind et
        const Fancybox = (window as any).Fancybox;
        Fancybox.bind("[data-fancybox]", {
          Toolbar: {
            display: {
              left: ["infobar"],
              middle: [],
              right: ["slideshow", "download", "thumbs", "close"],
            },
          },
          Thumbs: {
            autoStart: false,
          },
          Image: {
            zoom: true,
          },
          Swipe: {
            threshold: 50,
          },
        });
      }
    };

    loadFancybox();

    return () => {
      const Fancybox = (window as any).Fancybox;
      if (Fancybox && typeof Fancybox.destroy === 'function') {
        Fancybox.destroy();
      }
    };
  }, []);

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

  const cars = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'ekonomik',
      brand: 'Hyundai',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
      images: [
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
        'https://images.unsplash.com/photo-1619767886463-eca0bc90544a?q=80&w=1000',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
        'https://images.unsplash.com/photo-1494976687768-f8e4db6a8b6a?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1000',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
        'https://images.unsplash.com/photo-1494976687768-f8e4db6a8b6a?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
        'https://images.unsplash.com/photo-1494976687768-f8e4db6a8b6a?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000',
        'https://images.unsplash.com/photo-1494976687768-f8e4db6a8b6a?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1000',
        'https://images.unsplash.com/photo-1494976687768-f8e4db6a8b6a?q=80&w=1000',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
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
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1000',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      ],
      price: 180,
      seats: 8,
      fuel: 'Diesel',
      year: 2023,
    },
  ];

  const filteredCars = cars.filter(car => {
    // Category mapping
    const categoryMap: Record<string, string> = {
      'ekonomik': 'ekonomik',
      'medium-sedan': 'ekonomik', // map to existing categories
      'biznes': 'biznes',
      'premium': 'premium',
      'suv': 'suv',
      'minivan': 'minivan',
      'luxury': 'premium', // map to premium
      'big-bus': 'minivan', // map to minivan
    };
    
    const matchesCategory = selectedCategory === 'all' || 
      car.category === selectedCategory || 
      car.category === categoryMap[selectedCategory];
    
    return matchesCategory;
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
                {/* Image Gallery with Swipe Slider and Fancybox */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', minHeight: '280px' }}>
                  {/* Swipe Slider for Images */}
                  {car.images && car.images.length > 0 ? (
                    <Carousel
                      className="w-full h-full"
                      opts={{
                        align: 'start',
                        loop: true,
                        dragFree: true,
                      }}
                    >
                      <CarouselContent className="h-full">
                        {car.images.map((image, index) => (
                          <CarouselItem key={index} className="h-full pl-0">
                            <a
                              href={image}
                              data-fancybox={`car-${car.id}`}
                              data-caption={`${car.name} - ${index + 1}`}
                              className="block w-full h-full cursor-zoom-in"
                            >
                              <img 
                                src={image} 
                                alt={`${car.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  ) : (
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>
                
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-6">{car.name}</h3>
                  
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
                    <ArrowRight className="ml-2 w-4 h-4" />
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
                  setSelectedCategory('all');
                  handleCategoryChange('all');
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
