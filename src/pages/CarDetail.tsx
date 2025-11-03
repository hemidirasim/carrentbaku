import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Fuel, Calendar, Shield, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';
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
  transmission: string;
  available: boolean;
  year: number;
  features: string[];
}

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (id) {
      loadCar();
    }
  }, [id]);

  const loadCar = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.cars.getById(id);
      setCar(data);
    } catch (error) {
      console.error('Error loading car:', error);
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

  // Get images array from car
  const getCarImages = (): string[] => {
    if (!car) return [];
    if (Array.isArray(car.image_url)) {
      return car.image_url.map(url => parseImageUrl(url)).filter(url => url);
    }
    const singleImage = parseImageUrl(car.image_url || '');
    return singleImage ? [singleImage] : [];
  };

  const getCarName = () => {
    if (!car) return '';
    return `${car.brand} ${car.model}`;
  };

  // Fancybox-i init et (CDN-dən yüklə)
  useEffect(() => {
    if (typeof window === 'undefined' || !car) return;
    
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
  }, [car]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  const images = getCarImages();

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
            {getCarName()}
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
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      data-fancybox="gallery"
                      data-caption={`${getCarName()} - ${index + 1}`}
                      className={index === selectedImage ? "block w-full h-full" : "hidden"}
                    >
                      {index === selectedImage && (
                        <img
                          src={image}
                          alt={`${getCarName()} ${index + 1}`}
                          className="w-full h-full object-cover cursor-zoom-in"
                        />
                      )}
                    </a>
                  ))
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt={getCarName()}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-2">
                  {images.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      data-fancybox="gallery"
                      data-caption={`${getCarName()} - ${index + 1}`}
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
                        alt={`${getCarName()} thumbnail ${index + 1}`} 
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
                        <p className="font-semibold text-sm sm:text-base truncate">{car.fuel_type}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground">Transmission</p>
                        <p className="font-semibold text-sm sm:text-base capitalize">{car.transmission}</p>
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
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">{car.price_per_day}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-white/90">AZN</span>
                          </div>
                        </div>
                        {/* Həftə */}
                        <div className="rounded-lg p-2 sm:p-3 text-center border border-border">
                          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-900">{car.price_per_day * 7}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-700">AZN</span>
                          </div>
                        </div>
                        {/* Ay */}
                        <div className="rounded-lg p-2 sm:p-3 text-center border border-border">
                          <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-slate-900">{car.price_per_day * 30}</span>
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-700">AZN</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary text-sm sm:text-base md:text-lg py-4 sm:py-5 md:py-6"
                      onClick={() => setReservationOpen(true)}
                      disabled={!car.available}
                    >
                      {car.available ? t('detail.reserve') : 'Mövcud deyil'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              {car.features && car.features.length > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </section>

      <ReservationDialog
        open={reservationOpen}
        onOpenChange={setReservationOpen}
        carName={getCarName()}
      />
    </div>
  );
};

export default CarDetail;
