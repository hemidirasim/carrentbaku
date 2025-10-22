import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const Hero = () => {
  const { t } = useLanguage();
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {[
              'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070',
              'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=2070',
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070',
            ].map((src, idx) => (
              <CarouselItem key={idx} className="h-[600px] md:h-[700px] lg:h-[800px]">
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Gradient overlay above images */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90 z-[1]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setIsReservationOpen(true)}
              className="bg-accent hover:bg-accent-light text-white shadow-glow hover:shadow-elegant transition-all text-lg px-8 py-6 group"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-sm text-white/80">Avtomobil</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-white/80">Dəstək</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">8+</div>
              <div className="text-sm text-white/80">İl təcrübə</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-sm text-white/80">Məmnun müştəri</div>
            </div>
          </div>
        </div>
      </div>

      <ReservationDialog 
        open={isReservationOpen} 
        onOpenChange={setIsReservationOpen}
      />
    </section>
  );
};

export default Hero;
