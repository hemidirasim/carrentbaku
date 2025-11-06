import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Check } from 'lucide-react';

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
}

const Services = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.services.getAll();
      // Limit to 6 services for home page
      setServices((data || []).slice(0, 6));
    } catch (error) {
      console.error('Error loading services:', error);
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

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header row */}
        <div className="flex flex-col items-start text-left mb-10 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {t('services.comprehensive.title.part1')} <span className="text-accent">{t('services.comprehensive.title.part2')}</span><br/>
            {t('services.comprehensive.title.part3')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('services.comprehensive.subtitle')}
          </p>
        </div>

        {/* Cards row */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Yüklənir...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Hələ xidmət yoxdur</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const images = getServiceImages(service);
              const firstImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600';
              const features = getServiceFeatures(service);
              
              return (
                <Card key={service.id} className="overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={firstImage} 
                      alt={getServiceTitle(service)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">{getServiceTitle(service)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{getServiceDescription(service)}</CardDescription>
                    {features.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {features.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{features.length - 2} daha...
                          </div>
                        )}
                      </div>
                    )}
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-white w-full"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      {t('common.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
