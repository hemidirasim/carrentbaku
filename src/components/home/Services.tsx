import { Car, Plane, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Car,
      title: t('services.rental'),
      description: t('services.rental.desc'),
      gradient: 'from-primary to-primary-light',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
    },
    {
      icon: Plane,
      title: t('services.airport'),
      description: t('services.airport.desc'),
      gradient: 'from-accent to-accent-light',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000',
    },
    {
      icon: Calendar,
      title: t('services.daily'),
      description: t('services.daily.desc'),
      gradient: 'from-primary-light to-primary-glow',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
    },
    {
      icon: User,
      title: t('services.driver'),
      description: t('services.driver.desc'),
      gradient: 'from-accent-light to-accent',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
    },
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            Bizim geniş xidmət paketimizlə tanış olun
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {services.map((service, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card border-border overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Services;