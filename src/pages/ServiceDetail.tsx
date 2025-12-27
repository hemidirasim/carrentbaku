import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface Car {
  id: string;
  brand: string;
  model: string;
  category: string;
  image_url?: string[] | string;
  price_per_day?: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  unavailable_dates?: string[] | null;
}

interface Service {
  id: string;
  title_az: string;
  title_ru?: string;
  title_en?: string;
  title_ar?: string;
  description_az: string;
  description_ru?: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string | string[];
  features?: string | { az?: string[]; ru?: string[]; en?: string[]; ar?: string[] };
  cars?: Car[];
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const fancyboxLoaded = useRef(false);

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id]);

  useEffect(() => {
    if (service && !fancyboxLoaded.current) {
      loadFancybox();
    }

    return () => {
      const Fancybox = (window as any).Fancybox;
      if (Fancybox && typeof Fancybox.destroy === 'function') {
        Fancybox.destroy();
      }
    };
  }, [service]);

  const loadFancybox = () => {
    if (fancyboxLoaded.current) return;
    
    if (!(window as any).Fancybox) {
      // Load Fancybox CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css';
      document.head.appendChild(link);

      // Load Fancybox JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js';
      script.onload = () => {
        fancyboxLoaded.current = true;
        const Fancybox = (window as any).Fancybox;
        Fancybox.bind("[data-fancybox='service-gallery']", {
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
      };
      document.head.appendChild(script);
    } else {
      fancyboxLoaded.current = true;
      const Fancybox = (window as any).Fancybox;
      Fancybox.bind("[data-fancybox='service-gallery']", {
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

  const loadService = async (serviceId: string) => {
    try {
      setLoading(true);
      const data = await api.services.getById(serviceId);
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceTitle = (service: Service) => {
    switch (language) {
      case 'ru': return service.title_ru || service.title_az;
      case 'en': return service.title_en || service.title_az;
      case 'ar': return service.title_ar || service.title_az;
      default: return service.title_az;
    }
  };

  const getServiceDescription = (service: Service) => {
    switch (language) {
      case 'ru': return service.description_ru || service.description_az;
      case 'en': return service.description_en || service.description_az;
      case 'ar': return service.description_ar || service.description_az;
      default: return service.description_az;
    }
  };

  const getServiceFeatures = (service: Service): string[] => {
    if (!service.features) return [];
    
    if (typeof service.features === 'string') {
      try {
        const parsed = JSON.parse(service.features);
        return parsed[language] || parsed.az || [];
      } catch {
        return [];
      }
    } else if (typeof service.features === 'object') {
      return service.features[language as keyof typeof service.features] || service.features.az || [];
    }
    return [];
  };

  const getServiceImages = (service: Service): string[] => {
    if (!service.image_url) return [];
    
    if (Array.isArray(service.image_url)) {
      return service.image_url;
    } else if (typeof service.image_url === 'string') {
      try {
        const parsed = JSON.parse(service.image_url);
        return Array.isArray(parsed) ? parsed : [service.image_url];
      } catch {
        return [service.image_url];
      }
    }
    return [];
  };

  const getCarImage = (car: Car): string => {
    if (!car.image_url) {
      return '/placeholder.svg';
    }
    if (Array.isArray(car.image_url)) {
      return car.image_url[0] || '/placeholder.svg';
    }
    if (typeof car.image_url === 'string') {
      try {
        const parsed = JSON.parse(car.image_url);
        if (Array.isArray(parsed)) {
          return parsed[0] || '/placeholder.svg';
        }
      } catch {
        return car.image_url;
      }
      return car.image_url;
    }
    return '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('services.detail.notFound')}</h2>
          <Button onClick={() => navigate('/services')}>{t('services.detail.backToList')}</Button>
        </div>
      </div>
    );
  }

  const images = getServiceImages(service);
  const features = getServiceFeatures(service);

  const serviceCars = Array.isArray(service.cars) ? service.cars : [];

  const getCarCategoryLabel = (slug: string) => {
    const translationKey = `cars.filter.${slug}`;
    const translated = t(translationKey);
    if (translated !== translationKey) {
      return translated;
    }
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/services')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('services.detail.backToList')}
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Info */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{getServiceTitle(service)}</h1>
            <p className="text-lg text-muted-foreground">{getServiceDescription(service)}</p>
          </div>

          {/* Featured Images */}
          {images.length > 0 ? (
            <div className="mb-8">
              {images.length === 1 ? (
                <a
                  href={images[0]}
                  data-fancybox="service-gallery"
                  data-caption={getServiceTitle(service)}
                >
                  <img
                    src={images[0]}
                    alt={getServiceTitle(service)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
                  />
                </a>
              ) : (
                <div className="space-y-4">
                  {/* Main Image Slider */}
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <a
                            href={image}
                            data-fancybox="service-gallery"
                            data-caption={`${getServiceTitle(service)} - ${index + 1}`}
                            data-thumb={image}
                          >
                            <img
                              src={image}
                              alt={`${getServiceTitle(service)} - ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
                            />
                          </a>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  
                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          data-fancybox="service-gallery"
                          data-caption={`${getServiceTitle(service)} - ${index + 1}`}
                          data-thumb={image}
                          className={`rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-20 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted" style={{ aspectRatio: '16 / 9', minHeight: '400px' }}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">{t('common.noImage')}</span>
              </div>
            </div>
          )}

          {/* Related Cars */}
          {serviceCars.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">{t('services.detail.relatedCars')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceCars.map(car => (
                    <Card key={car.id} className="overflow-hidden border-border">
                      <CardContent className="p-0">
                        <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                          <img
                            src={getCarImage(car)}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-2">
                          <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray((car as any).categories) && (car as any).categories.length > 0 ? (car as any).categories : (car.category ? [car.category] : []))
                              .filter((slug: unknown): slug is string => typeof slug === 'string' && slug.trim().length > 0)
                              .map(slug => (
                                <span
                                  key={slug}
                                  className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wide"
                                >
                                  {getCarCategoryLabel(slug)}
                                </span>
                              ))
                            }
                          </div>
                          {(car.price_per_day || car.price_per_week || car.price_per_month) && (
                            <div className="text-sm text-foreground">
                              {car.price_per_day && (<div>{t('services.detail.price.perDay')}: <strong>{car.price_per_day} AZN</strong></div>)}
                              {car.price_per_week && (<div>{t('services.detail.price.perWeek')}: <strong>{car.price_per_week} AZN</strong></div>)}
                              {car.price_per_month && (<div>{t('services.detail.price.perMonth')}: <strong>{car.price_per_month} AZN</strong></div>)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {/* Features */}
          {features.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">{t('services.detail.features')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button 
              size="lg"
              className="bg-gradient-primary text-lg px-8"
              onClick={() => navigate('/contact')}
            >
              {t('cta.button')}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ServiceDetail;
