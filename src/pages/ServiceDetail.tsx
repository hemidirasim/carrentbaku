import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock services data - in production, this would come from an API
  const services = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1600',
      title: t('services.dailyWeekly.title'),
      description: t('services.dailyWeekly.desc'),
      features: [
        'Flexible rental periods',
        'No hidden fees',
        '24/7 customer support',
        'Easy online booking',
        'Free cancellation',
      ],
      content: `
        <p>Our daily and weekly car rental service offers the perfect solution for short-term transportation needs. Whether you're planning a weekend getaway or need a vehicle for a week-long business trip, we have flexible options to suit your schedule.</p>
        <p>All our vehicles are regularly maintained and fully insured, giving you peace of mind during your rental period.</p>
      `,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1619767886777-a38c46a5e8d6?q=80&w=1600',
      title: t('services.longTerm.title'),
      description: t('services.longTerm.desc'),
      features: [
        'Discounted monthly rates',
        'Priority vehicle selection',
        'Dedicated account manager',
        'Flexible payment plans',
        'Vehicle maintenance included',
      ],
      content: `
        <p>For extended rental needs, our long-term rental service provides cost-effective solutions with significant savings compared to daily rates.</p>
        <p>Ideal for businesses, relocation, or any situation requiring a vehicle for an extended period.</p>
      `,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552519507-88aa1e2c1c4d?q=80&w=1600',
      title: t('services.luxury.title'),
      description: t('services.luxury.desc'),
      features: [
        'Premium vehicle selection',
        'Concierge service',
        'Premium insurance',
        'Luxury amenities',
        'White-glove delivery',
      ],
      content: `
        <p>Experience the ultimate in comfort and style with our luxury car rental service. Perfect for special occasions, executive travel, or simply treating yourself.</p>
        <p>Our premium fleet includes the latest models from top manufacturers, all equipped with the finest features and amenities.</p>
      `,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600',
      title: t('services.airport'),
      description: t('services.airport.desc'),
      features: [
        'Airport pickup and drop-off',
        'Flight tracking',
        'Meet and greet service',
        'Luggage assistance',
        'Express check-in',
      ],
      content: `
        <p>Start your journey stress-free with our airport transfer service. We provide reliable transportation to and from Baku's international airport.</p>
        <p>Our drivers track your flight status to ensure timely pickup, and we assist with your luggage for a seamless experience.</p>
      `,
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600',
      title: t('services.driver'),
      description: t('services.driver.desc'),
      features: [
        'Professional drivers',
        'Local knowledge',
        'Flexible scheduling',
        'GPS navigation',
        'Safe and reliable',
      ],
      content: `
        <p>Relax and enjoy your journey with our professional driver service. Our experienced drivers are knowledgeable about local routes and destinations.</p>
        <p>Perfect for business meetings, events, or when you prefer to be driven rather than drive yourself.</p>
      `,
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1600',
      title: t('services.rental'),
      description: t('services.rental.desc'),
      features: [
        'Wide vehicle selection',
        'Competitive pricing',
        'Flexible terms',
        'Quick approval',
        'All-inclusive packages',
      ],
      content: `
        <p>Our comprehensive car rental service covers all your transportation needs with a wide selection of vehicles from economy to luxury.</p>
        <p>We offer competitive pricing and flexible rental terms to ensure you find the perfect vehicle for your needs and budget.</p>
      `,
    },
  ];

  const service = services.find(s => s.id === Number(id));

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Xidmət tapılmadı</h2>
          <Button onClick={() => navigate('/services')}>Xidmətlərə qayıt</Button>
        </div>
      </div>
    );
  }

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
            Xidmətlərə qayıt
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Info */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-lg text-muted-foreground">{service.description}</p>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16 / 9', minHeight: '400px' }}
            />
          </div>

          {/* Content */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Xidmətin Xüsusiyyətləri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
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

