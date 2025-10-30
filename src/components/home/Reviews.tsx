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
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10">
          {t('reviews.title')}
        </h2>
        <div className="max-w-6xl mx-auto">
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
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Reviews;