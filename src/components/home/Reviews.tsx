import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Reviews = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: 'Anar Məmmədov',
      rating: 5,
      text: 'Çox keyfiyyətli xidmət! Avtomobil təmiz və yeni idi. Tövsiyə edirəm!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anar',
    },
    {
      id: 2,
      name: 'Dmitry Ivanov',
      rating: 5,
      text: 'Отличный сервис! Машина в идеальном состоянии. Рекомендую всем!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    },
    {
      id: 3,
      name: 'John Smith',
      rating: 5,
      text: 'Excellent service! The car was perfect and the staff was very helpful.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: 4,
      name: 'Leyla Əliyeva',
      rating: 5,
      text: 'Hava limanından götürdük, çox rahat oldu. Peşəkar komanda!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla',
    },
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <Card 
              key={review.id}
              className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full bg-secondary"
                  />
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Video Rəylər</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="aspect-video rounded-lg bg-secondary flex items-center justify-center hover:shadow-elegant transition-all cursor-pointer group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Müştəri Rəyi #{i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
