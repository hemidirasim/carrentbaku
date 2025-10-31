import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const Reviews = () => {
  const { t } = useLanguage();

  const cards = [
    {
      title: t('reviews.card1.title'),
      text:
        'The attention to detail in the booking process made our trip stress-free, allowing us to focus on creating lasting memories together.',
      name: 'Sara Mohamed',
      location: 'Jakarta',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Sara',
      rating: 5,
    },
    {
      title: t('reviews.card2.title'),
      text:
        "I've used many car rental platforms before, but our booking system is hands down the best! The process is so smooth and straightforward.",
      name: 'Sophia Moore',
      location: 'New York',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Sophia',
      rating: 5,
    },
    {
      title: t('reviews.card3.title'),
      text:
        'Everything is laid out clearly, and there are multiple payment options, which makes things super convenient.',
      name: 'Atend John',
      location: 'Tokyo',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= John',
      rating: 5,
    },
    {
      title: t('reviews.card1.title'),
      text:
        'Great communication and quick pickup. The car was clean and fuel-efficient. Will rent again on my next trip.',
      name: 'Ali Rzayev',
      location: 'Baku',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Ali',
      rating: 5,
    },
    {
      title: t('reviews.card2.title'),
      text:
        'Booking took less than two minutes and everything matched the description. Support was friendly and helpful.',
      name: 'Elena Petrova',
      location: 'Saint Petersburg',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Elena',
      rating: 5,
    },
    {
      title: t('reviews.card3.title'),
      text:
        'Multiple payment choices and clear policies. Returning the vehicle was seamless and super convenient.',
      name: 'Omar Al-Khaled',
      location: 'Dubai',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Omar',
      rating: 5,
    },
    {
      title: t('reviews.card1.title'),
      text:
        'Perfect for a weekend getaway. The whole experience felt easy and well-organized from start to finish.',
      name: 'Leyla Aliyeva',
      location: 'Ganja',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Leyla',
      rating: 5,
    },
    {
      title: t('reviews.card2.title'),
      text:
        'Fast pickup at the airport and the car exceeded expectations. Excellent value for money.',
      name: 'Mehmet Yilmaz',
      location: 'Istanbul',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Mehmet',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10">
          {t('reviews.title')}
        </h2>
        <div className="relative">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent>
              {cards.map((c, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{c.title}</h3>
                      <p className="text-muted-foreground mb-6">{c.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full" />
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-sm text-muted-foreground">{c.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(c.rating)].map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-green-500 text-green-500" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -top-12 right-0 bg-white border border-border text-slate-700 hover:bg-slate-50 z-10" />
            <CarouselNext className="absolute -top-12 right-12 bg-white border border-border text-slate-700 hover:bg-slate-50 z-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Reviews;