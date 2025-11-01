import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const services = [
    {
      image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600',
      title: t('services.dailyWeekly.title'),
      desc: t('services.dailyWeekly.desc'),
    },
    {
      image: 'https://images.unsplash.com/photo-1619767886777-a38c46a5e8d6?q=80&w=1600',
      title: t('services.longTerm.title'),
      desc: t('services.longTerm.desc'),
    },
    {
      image: 'https://images.unsplash.com/photo-1552519507-88aa1e2c1c4d?q=80&w=1600',
      title: t('services.luxury.title'),
      desc: t('services.luxury.desc'),
    },
    {
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600',
      title: t('services.airport'),
      desc: t('services.airport.desc'),
    },
    {
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600',
      title: t('services.driver'),
      desc: t('services.driver.desc'),
    },
    {
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1600',
      title: t('services.rental'),
      desc: t('services.rental.desc'),
    },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Card 
                key={i} 
                className="overflow-hidden border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                onClick={() => navigate(`/services/${i + 1}`)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{service.desc}</CardDescription>
                  <Button 
                    className="w-full bg-gradient-primary group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/${i + 1}`);
                    }}
                  >
                    {t('common.viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
