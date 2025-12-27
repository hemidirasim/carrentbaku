import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
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
  rating: number;
  videoUrl?: string;
}

const toEmbedUrl = (input: string): string => {
  try {
    const trimmed = input.trim();
    if (!trimmed) {
      return '';
    }
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split('/').filter(Boolean);
    let videoId = '';

    if (host.includes('youtube.com')) {
      if (segments[0] === 'shorts' && segments[1]) {
        videoId = segments[1];
      } else if (segments[0] === 'embed' && segments[1]) {
        videoId = segments[1];
      } else if (url.searchParams.has('v')) {
        videoId = url.searchParams.get('v') ?? '';
      }
    } else if (host.includes('youtu.be')) {
      if (segments[0] === 'shorts' && segments[1]) {
        videoId = segments[1];
      } else if (segments[0]) {
        videoId = segments[0];
      }
    }

    videoId = videoId.split('?')[0].split('&')[0];

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return trimmed;
  } catch {
    return input;
  }
};

const Reviews = () => {
  const { t, language } = useLanguage();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await api.reviews.getAll({ featured: true });
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any): ReviewCard => {
            const getLocalized = (prefix: string) => {
              const value = item[`${prefix}_${language}`];
              if (typeof value === 'string' && value.trim()) {
                return value.trim();
              }
              const fallback = item[`${prefix}_az`];
              return typeof fallback === 'string' ? fallback.trim() : '';
            };

            const text = getLocalized('content');
            const title = getLocalized('title');
            const location = typeof item.customer_location === 'string' ? item.customer_location : '';
            const rating = Number.isFinite(item.rating) ? Math.min(5, Math.max(1, Number(item.rating))) : 5;
            const type = item.review_type === 'video' ? 'video' : 'text';
            const videoUrl = type === 'video' && typeof item.video_url === 'string' ? toEmbedUrl(item.video_url) : undefined;

            return {
              type,
              title: title || t('reviews.card1.title'),
              text: text || t('reviews.review1.text'),
              name: (item.customer_name || '').trim() || 'Müştəri',
              location,
              rating,
              videoUrl,
            };
          }).filter(card => card.text.trim().length > 0 || card.videoUrl);
          setReviews(mapped);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [language, t]);

  useEffect(() => {
    if (!carouselApi) return;

    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());

    carouselApi.on('select', () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    });
  }, [carouselApi]);

  const defaultCards: ReviewCard[] = [
    {
      type: 'text',
      title: t('reviews.card1.title'),
      text: t('reviews.review1.text'),
      name: 'Sara Mohamed',
      location: 'Jakarta',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card2.title'),
      text: t('reviews.review2.text'),
      name: 'Sophia Moore',
      location: 'New York',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      type: 'text',
      title: t('reviews.card3.title'),
      text: t('reviews.review3.text'),
      name: 'Atend John',
      location: 'Tokyo',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card1.title'),
      text: t('reviews.review4.text'),
      name: 'Ali Rzayev',
      location: 'Baku',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    },
    {
      type: 'text',
      title: t('reviews.card2.title'),
      text: t('reviews.review5.text'),
      name: 'Elena Petrova',
      location: 'Saint Petersburg',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card3.title'),
      text: t('reviews.review6.text'),
      name: 'Omar Al-Khaled',
      location: 'Dubai',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    },
    {
      type: 'text',
      title: t('reviews.card1.title'),
      text: t('reviews.review7.text'),
      name: 'Leyla Aliyeva',
      location: 'Ganja',
      rating: 5,
    },
    {
      type: 'video',
      title: t('reviews.card2.title'),
      text: t('reviews.review8.text'),
      name: 'Mehmet Yilmaz',
      location: 'Istanbul',
      rating: 5,
      videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    },
  ];

  const activeCards = reviews.length > 0 ? reviews : defaultCards;

  if (loading && reviews.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 max-w-full">
          <div className="flex flex-col items-start text-left max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {t('reviews.comprehensive.title.part1')} <span className="text-accent">{t('reviews.comprehensive.title.part2')}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('reviews.comprehensive.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="bg-white border border-border text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="bg-white border border-border text-slate-700 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Carousel opts={{ align: 'start', loop: true }} setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {activeCards.map((c, i) => (
                <CarouselItem key={i} className="md:basis-2/3 lg:basis-1/2">
                  <Card className="border-border overflow-hidden h-full">
                    {c.type === 'video' && c.videoUrl ? (
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="flex-1 p-6">
                            <p className="text-muted-foreground mb-6">{c.text}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
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
                        <p className="text-muted-foreground mb-6">{c.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
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