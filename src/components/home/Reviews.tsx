import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Reviews = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: 'Anar Məmmədov',
      location: 'Bakı, Azərbaycan',
      rating: 5,
      date: '15 Yanvar 2024',
      text: 'Çox keyfiyyətli xidmət! Avtomobil təmiz və yeni idi. Xidmət şəffaf və peşəkardır. Hava limanından götürdük, hər şey rahat və sürətli oldu. Mütləq tövsiyə edirəm!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anar',
      carType: 'Mercedes E-Class',
      verified: true,
    },
    {
      id: 2,
      name: 'Dmitry Ivanov',
      location: 'Moskva, Rusiya',
      rating: 5,
      date: '22 Yanvar 2024',
      text: 'Отличный сервис! Машина в идеальном состоянии, чистая и современная. Персонал очень внимательный и профессиональный. Всё прошло гладко от начала до конца.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      carType: 'BMW 5 Series',
      verified: true,
    },
    {
      id: 3,
      name: 'John Smith',
      location: 'London, UK',
      rating: 5,
      date: '10 Fevral 2024',
      text: 'Excellent service! The car was perfect and the staff was very helpful. Everything was straightforward and professional. Would definitely use again!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      carType: 'Toyota Camry',
      verified: true,
    },
    {
      id: 4,
      name: 'Leyla Əliyeva',
      location: 'Bakı, Azərbaycan',
      rating: 5,
      date: '5 Mart 2024',
      text: 'Hava limanından götürdük, çox rahat oldu. Peşəkar komanda! Avtomobil çox təmiz və rahat idi. Xidmət 24/7 mövcuddur və çox sürətli cavab verirlər.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla',
      carType: 'Hyundai Elantra',
      verified: true,
    },
    {
      id: 5,
      name: 'Ahmed Al-Rashid',
      location: 'Dubai, UAE',
      rating: 5,
      date: '18 Mart 2024',
      text: 'خدمة ممتازة! السيارة كانت نظيفة جداً والموظفون محترفون. كل شيء كان سلساً وسريعاً. أنصح بشدة باستخدام هذه الخدمة.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      carType: 'Mercedes E-Class',
      verified: true,
    },
    {
      id: 6,
      name: 'Elena Petrova',
      location: 'Sankt-Peterburq, Rusiya',
      rating: 5,
      date: '1 Aprel 2024',
      text: 'Прекрасный опыт! Всё прошло гладко от начала до конца. Машина была в отличном состоянии, персонал дружелюбный и профессиональный.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      carType: 'Kia Rio',
      verified: true,
    },
    {
      id: 7,
      name: 'Mehmet Yılmaz',
      location: 'İstanbul, Türkiyə',
      rating: 5,
      date: '12 Aprel 2024',
      text: 'Harika bir hizmet! Araba çok temiz ve yeniydi. Personel çok yardımsever ve profesyonel. Kesinlikle tavsiye ederim!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
      carType: 'Honda Accord',
      verified: true,
    },
    {
      id: 8,
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      date: '25 Aprel 2024',
      text: 'Amazing service! The car was spotless and everything was handled professionally. Great communication throughout the process. Highly recommend!',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      carType: 'BMW X5',
      verified: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background via-gradient-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t('reviews.subtitle')}
          </p>
          {/* Average Rating */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-full">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-white">4.9/5</span>
            <span className="text-white/80 text-sm">({reviews.length} {t('reviews.reviews')})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={review.id}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              <CardContent className="pt-6 pb-6 space-y-4 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-14 h-14 rounded-full border-2 border-primary/20 ring-2 ring-primary/10"
                      />
                      {review.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base truncate">{review.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{review.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex space-x-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {review.carType}
                  </Badge>
                </div>

                {/* Review Text */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5 group-hover:line-clamp-none transition-all">
                  {review.text}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{review.date}</span>
                  </div>
                  {review.verified && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {t('reviews.verified')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;