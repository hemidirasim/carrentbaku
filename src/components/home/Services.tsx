import { Car, Plane, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Car,
      title: t('services.rental'),
      description: t('services.rental.desc'),
      gradient: 'from-primary to-primary-light',
    },
    {
      icon: Plane,
      title: t('services.airport'),
      description: t('services.airport.desc'),
      gradient: 'from-accent to-accent-light',
    },
    {
      icon: Calendar,
      title: t('services.daily'),
      description: t('services.daily.desc'),
      gradient: 'from-primary-light to-primary-glow',
    },
    {
      icon: User,
      title: t('services.driver'),
      description: t('services.driver.desc'),
      gradient: 'from-accent-light to-accent',
    },
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
