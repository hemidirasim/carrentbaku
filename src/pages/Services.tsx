import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plane, Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Car,
      title: t('services.rental'),
      description: t('services.rental.desc'),
      details: 'Geniş çeşiddə avtomobillərimiz ilə istənilən səyahət ehtiyacınızı qarşılayırıq. Ekonom sinifdən premium avtomobillərə qədər seçim imkanı.',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      gradient: 'from-primary to-primary-light',
    },
    {
      icon: Plane,
      title: t('services.airport'),
      description: t('services.airport.desc'),
      details: '24/7 hava limanı transfer xidməti. Heydər Əliyev Beynəlxalq Hava Limanından və ya hava limanına rahat və təhlükəsiz çatdırılma.',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000',
      gradient: 'from-accent to-accent-light',
    },
    {
      icon: Calendar,
      title: t('services.daily'),
      description: t('services.daily.desc'),
      details: 'Əlverişli günlük kirayə tariflərə qısamüddətli və uzunmüddətli kirayə imkanları. Xüsusi endirimlər uzunmüddətli kirayələr üçün.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
      gradient: 'from-primary-light to-primary-glow',
    },
    {
      icon: User,
      title: t('services.driver'),
      description: t('services.driver.desc'),
      details: 'Təcrübəli və peşəkar sürücülərimiz ilə rahat və təhlükəsiz səyahət. Bakı şəhərində və ətraf ərazilərdə xidmət.',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
      gradient: 'from-accent-light to-accent',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('services.title')}
          </h1>
          <p className="text-white/90 text-center text-lg max-w-2xl mx-auto">
            Premium avtomobil kirayə və əlavə xidmətlərimiz ilə tanış olun
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Card className="border-none shadow-elegant">
                    <div className="relative h-80 overflow-hidden rounded-t-lg">
                      <img 
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </Card>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {service.details}
                  </p>

                  <Button className="bg-gradient-primary group">
                    Ətraflı məlumat
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Niyə Biz?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <CardTitle>100% Təmiz Avtomobillər</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Hər avtomobil təhvil verilməzdən əvvəl detallı təmizlənir və dezinfeksiya edilir
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle>Sürətli Təhvil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Minimum rəsmiləşdirmə və 30 dəqiqə ərzində avtomobil təhvili
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <CardTitle>Tam Sığorta</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bütün avtomobillərimiz tam KASKO sığortası ilə təchiz edilmişdir
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
