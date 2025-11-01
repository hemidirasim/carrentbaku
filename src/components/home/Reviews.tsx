import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

interface ReviewCard {
  type: 'text' | 'video';
  title: string;
  text: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  videoUrl?: string;
}

const Reviews = () => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on('select', () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const cards: ReviewCard[] = [
    {
      type: 'text',
      title: t('reviews.card1.title'),
      text: t('reviews.review1.text'),
      name: 'Sara Mohamed',
      location: 'Jakarta',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Sara',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card2.title'),
      text: t('reviews.review2.text'),
      name: 'Sophia Moore',
      location: 'New York',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Sophia',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      type: 'text',
      title: t('reviews.card3.title'),
      text: t('reviews.review3.text'),
      name: 'Atend John',
      location: 'Tokyo',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= John',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card1.title'),
      text: t('reviews.review4.text'),
      name: 'Ali Rzayev',
      location: 'Baku',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Ali',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    },
    {
      type: 'text',
      title: t('reviews.card2.title'),
      text: t('reviews.review5.text'),
      name: 'Elena Petrova',
      location: 'Saint Petersburg',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Elena',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card3.title'),
      text: t('reviews.review6.text'),
      name: 'Omar Al-Khaled',
      location: 'Dubai',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Omar',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    },
    {
      type: 'text',
      title: t('reviews.card1.title'),
      text: t('reviews.review7.text'),
      name: 'Leyla Aliyeva',
      location: 'Ganja',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Leyla',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card2.title'),
      text: t('reviews.review8.text'),
      name: 'Mehmet Yilmaz',
      location: 'Istanbul',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed= Mehmet',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              {t('reviews.title')}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="bg-white border border-border text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="bg-white border border-border text-slate-700 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="relative">
          <Carousel opts={{ align: 'start', loop: true }} setApi={setApi} className="w-full">
            <CarouselContent>
              {cards.map((c, i) => (
                <CarouselItem key={i} className="md:basis-2/3 lg:basis-1/2">
                  <Card className="border-border overflow-hidden h-full">
                    {c.type === 'video' && c.videoUrl ? (
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="flex-1 p-6">
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
                          </div>
                          <div className="relative w-full md:w-2/5" style={{ aspectRatio: '21 / 9', minHeight: '150px' }}>
                            <iframe
                              src={c.videoUrl}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`${c.name} review video`}
                            />
                            <div className="absolute top-2 right-2 bg-primary/80 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              {t('reviews.video')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    ) : (
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
                    )}
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Reviews;