import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Fuel, Calendar, Shield, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
            Fancybox.bind("[data-fancybox='gallery']", {
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
              on: {
                reveal: (fancybox: any, slide: any) => {
                  setSelectedImage(slide.index);
                },
              },
            });
          }
        };
        document.head.appendChild(script);
      } else {
        // Əgər artıq yüklənibsə, dərhal bind et
        const Fancybox = (window as any).Fancybox;
        Fancybox.bind("[data-fancybox='gallery']", {
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
          on: {
            reveal: (fancybox: any, slide: any) => {
              setSelectedImage(slide.index);
            },
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
  }, [id]);

  // Mock data - in production, this would come from an API
  const cars = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'economy',
      brand: 'Hyundai',
      images: [
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
        'https://images.unsplash.com/photo-1619767886463-eca0bc90544a?q=80&w=1000',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800',
      ],
      price: 55,
      deposit: 200,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'GPS Navigation', 'USB Port', 'Backup Camera'],
    },
    {
      id: 2,
      name: 'Toyota Camry',
      category: 'comfort',
      brand: 'Toyota',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800',
      ],
      price: 85,
      deposit: 300,
      seats: 5,
      fuel: 'Hybrid',
      year: 2023,
      features: ['Leather Seats', 'Sunroof', 'Bluetooth', 'Air Conditioning', 'GPS Navigation', 'Parking Sensors'],
    },
    {
      id: 3,
      name: 'Mercedes E-Class',
      category: 'premium',
      brand: 'Mercedes-Benz',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
      ],
      price: 150,
      deposit: 500,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Premium Leather', 'Panoramic Sunroof', 'Advanced Safety', 'Premium Sound', 'Heated Seats', 'Ambient Lighting'],
    },
    {
      id: 4,
      name: 'Kia Rio',
      category: 'economy',
      brand: 'Kia',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
      ],
      price: 50,
      deposit: 180,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'USB Port'],
    },
    {
      id: 5,
      name: 'BMW 5 Series',
      category: 'premium',
      brand: 'BMW',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      ],
      price: 180,
      deposit: 550,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Sport Package', 'Premium Sound', 'Adaptive Cruise', 'Lane Assist', 'Parking Assistant'],
    },
    {
      id: 6,
      name: 'Honda Accord',
      category: 'comfort',
      brand: 'Honda',
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      ],
      price: 80,
      deposit: 280,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Sunroof', 'Air Conditioning', 'GPS Navigation'],
    },
    {
      id: 7,
      name: 'Nissan Sentra',
      category: 'economy',
      brand: 'Nissan',
      images: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000',
      ],
      price: 60,
      deposit: 220,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'USB Port', 'Backup Camera'],
    },
    {
      id: 8,
      name: 'Audi A6',
      category: 'premium',
      brand: 'Audi',
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000',
      ],
      price: 170,
      deposit: 520,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Virtual Cockpit', 'Matrix LED', 'Premium Sound', 'Adaptive Suspension', 'Massage Seats'],
    },
  ];

  const car = cars.find(c => c.id === Number(id));

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Avtomobil tapılmadı</h2>
          <Button onClick={() => navigate('/cars')}>Avtomobillərə qayıt</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-primary py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cars')}
            className="text-white hover:bg-white/10 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('cars.viewAll')}
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {car.name}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Image Gallery with Fancybox */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image - Fancybox Gallery */}
              <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16 / 9', minHeight: '200px', maxHeight: '400px' }}>
                {/* All images in gallery for Fancybox */}
                {car.images.map((image, index) => (
                  <a
                    key={index}
                    href={image}
                    data-fancybox="gallery"
                    data-caption={`${car.name} - ${index + 1}`}
                    className={index === selectedImage ? "block w-full h-full" : "hidden"}
                  >
                    {index === selectedImage && (
                      <img
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        className="w-full h-full object-cover cursor-zoom-in"
                      />
                    )}
                  </a>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Thumbnail Navigation */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-2">
                  {car.images.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      data-fancybox="gallery"
                      data-caption={`${car.name} - ${index + 1}`}
                      onClick={(e) => {
                        setSelectedImage(index);
                        // Let Fancybox handle the click
                      }}
                      className={`h-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer block ${
                        selectedImage === index ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${car.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4">{t('detail.specs')}</h2>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">{t('detail.seats')}</p>
                        <p className="font-semibold text-sm sm:text-base">{car.seats}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">{t('detail.year')}</p>
                        <p className="font-semibold text-sm sm:text-base">{car.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Fuel className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">{t('detail.fuel')}</p>
                        <p className="font-semibold text-sm sm:text-base truncate">{car.fuel}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">{t('detail.deposit')}</p>
                        <p className="font-semibold text-sm sm:text-base">{car.deposit} AZN</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 sm:pt-6">
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{t('detail.price')}</p>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {/* Gün */}
                        <div className="rounded-lg p-2 sm:p-3 text-center bg-[#7b1020]">
                          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wide text-white mb-1">gün</div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">{car.price}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-white/90">AZN</span>
                          </div>
                        </div>
                        {/* Həftə */}
                        <div className="rounded-lg p-2 sm:p-3 text-center border border-border">
                          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-900">{car.price * 7}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-700">AZN</span>
                          </div>
                        </div>
                        {/* Ay */}
                        <div className="rounded-lg p-2 sm:p-3 text-center border border-border">
                          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-slate-900">{car.price * 30}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-700">AZN</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6"
                      onClick={() => setReservationOpen(true)}
                    >
                      {t('detail.reserve')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t('detail.features')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ReservationDialog
        open={reservationOpen}
        onOpenChange={setReservationOpen}
        carName={car.name}
      />
    </div>
  );
};

export default CarDetail;
