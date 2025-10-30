import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const cards = [
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header row */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {t('services.comprehensive.title.part1')} <span className="text-accent">{t('services.comprehensive.title.part2')}</span><br/>
            {t('services.comprehensive.title.part3')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('services.comprehensive.subtitle')}
          </p>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Card key={i} className="overflow-hidden border-border">
              <div className="h-52 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">{c.desc}</CardDescription>
                <Button className="bg-accent hover:bg-accent-light text-white">{t('common.viewDetails')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;