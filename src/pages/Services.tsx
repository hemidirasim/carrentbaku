import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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
  image_url?: string;
  features?: string[];
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
      setServices(data || []);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('services.title')}
          </h1>
          <p className="text-white/90 text-center text-lg max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header row */}
          <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {t('services.comprehensive.title.part1')} <span className="text-accent">{t('services.comprehensive.title.part2')}</span><br/>
              {t('services.comprehensive.title.part3')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('services.comprehensive.subtitle')}
            </p>
          </div>

          {/* Cards grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Yüklənir...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className="overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={service.image_url || 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600'} 
                      alt={getServiceTitle(service)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-base md:text-lg">{getServiceTitle(service)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{getServiceDescription(service)}</CardDescription>
                    {service.features && service.features.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{service.features.length - 3} daha...
                          </div>
                        )}
                      </div>
                    )}
                    <Button 
                      className="w-full bg-gradient-primary group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/services/${service.id}`);
                      }}
                    >
                      {t('common.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('services.whyUs.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1600" 
                  alt={t('services.whyUs.cleanCars.title')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t('services.whyUs.cleanCars.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('services.whyUs.cleanCars.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600" 
                  alt={t('services.whyUs.fastDelivery.title')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t('services.whyUs.fastDelivery.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('services.whyUs.fastDelivery.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617531653332-bd46c24f0068?q=80&w=1600" 
                  alt={t('services.whyUs.fullInsurance.title')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t('services.whyUs.fullInsurance.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t('services.whyUs.fullInsurance.desc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
