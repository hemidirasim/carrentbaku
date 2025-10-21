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
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 4,
      name: 'Leyla Əliyeva',
      rating: 5,
      text: 'Hava limanından götürdük, çox rahat oldu. Peşəkar komanda!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla',
    },
    {
      id: 5,
      name: 'Ahmed Al-Rashid',
      rating: 5,
      text: 'خدمة ممتازة! السيارة كانت نظيفة جداً والموظفون محترفون.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 6,
      name: 'Elena Petrova',
      rating: 5,
      text: 'Прекрасный опыт! Всё прошло гладко от начала до конца.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card 
              key={review.id}
              className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="pt-6 space-y-4">
                {/* Video Section */}
                {review.videoUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                    <iframe
                      src={review.videoUrl}
                      title={`${review.name} review`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Customer Info */}
                <div className="flex items-center space-x-4">
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

                {/* Review Text */}
                <p className="text-sm text-muted-foreground">
                  {review.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
