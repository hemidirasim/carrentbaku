import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Car, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Car, value: '100+', label: 'Avtomobil' },
    { icon: Users, value: '5000+', label: 'Məmnun Müştəri' },
    { icon: Award, value: '8+', label: 'İl Təcrübə' },
    { icon: Shield, value: '100%', label: 'Sığortalı' },
  ];

  const values = [
    {
      title: 'Keyfiyyət',
      description: 'Yüksək keyfiyyətli avtomobillər və xidmət standartları',
      icon: '⭐',
    },
    {
      title: 'Etibarlılıq',
      description: '8 illik təcrübə və minlərlə məmnun müştəri',
      icon: '🤝',
    },
    {
      title: 'Şəffaflıq',
      description: 'Gizli ödənişlər yoxdur, hər şey aydın və anlaşılandır',
      icon: '💎',
    },
    {
      title: 'Dəstək',
      description: '24/7 müştəri dəstəyi və yardım',
      icon: '🛟',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-primary py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            {t('about.title')}
          </h1>
          <p className="text-white/90 text-center text-lg md:text-xl max-w-4xl mx-auto">
            {t('about.tagline')}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Bizim Hekayəmiz</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t('about.description')}
                </p>
                <p>
                  2016-cı ildən Bakıda avtomobil icarə sektorunda fəaliyyət göstərərək, minlərlə müştəriyə xidmət göstərmişik. İlk günündən başlayaraq məqsədimiz müştərilərə ən yüksək keyfiyyətli xidmət və ən etibarlı avtomobilləri təqdim etmək olub.
                </p>
                <p>
                  Bu gün 100-dən çox müxtəlif sinifdən avtomobillə, peşəkar komandamız və 24/7 dəstək xidmətimizlə Bakının ən etibarlı avtomobil icarə şirkətlərindən biriyik.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                  alt="Office"
                  className="rounded-lg shadow-card"
                />
                <img 
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000"
                  alt="Service"
                  className="rounded-lg shadow-card"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                  alt="Cars"
                  className="rounded-lg shadow-card"
                />
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000"
                  alt="Fleet"
                  className="rounded-lg shadow-card"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dəyərlərimiz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all hover:-translate-y-2">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
