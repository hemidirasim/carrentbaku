import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { api, CategoryDto } from '@/lib/api';
import { resolveLocalizedValue } from '@/hooks/useContactInfo';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';

const HERO_HIGHLIGHTS: Record<Language, string> = {
  az: '50 manat',
  ru: '50 манат',
  en: '50 azn',
  ar: '50 مانات',
};

const Hero = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const keyword = HERO_HIGHLIGHTS[language]?.toLowerCase();
  const heroHeadlinePart2 = t('hero.headline.part2');

  const renderHeadlinePart = (text: string, key: string) => {
    if (!keyword || !text.toLowerCase().includes(keyword)) {
      return text;
    }
    const segments = text.split(new RegExp(`(${keyword})`, 'ig'));
    return segments.map((segment, index) =>
      segment.toLowerCase() === keyword ? (
        <span key={`${key}-${index}`} className="text-accent">
          {segment}
        </span>
      ) : (
        <span key={`${key}-${index}`}>{segment}</span>
      ),
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-10 sm:pt-0 sm:pb-0">
      {/* Background YouTube Video (desktop) */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block" data-video-src="https://www.youtube.com/watch?v=5qbjKpxfD64">
        <div className="w-full h-full relative">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/5qbjKpxfD64?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&playlist=5qbjKpxfD64&fs=0&disablekb=1"
            title="Hero Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{
              width: 'max(100vw, 177.78vh)', // 16:9 => 16/9*100vh
              height: 'max(56.25vw, 100vh)', // 9/16*100vw
            }}
          />
        </div>
      </div>

      {/* Mobile fallback background */}
      <div className="absolute inset-0 z-0 sm:hidden" style={{ backgroundColor: '#657886' }} />

      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left text */}
          <div className="text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
            <div className="text-accent font-semibold tracking-wide mb-2">{t('hero.tagline')}</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {renderHeadlinePart(t('hero.headline.part1'), 'hero-headline-part1')}
              <br />
              <span className="text-accent">{heroHeadlinePart2}</span>
            </h1>
            <p className="mt-6 text-white/90 text-lg max-w-xl mx-auto sm:mx-0">
              {t('hero.description')}
            </p>
          </div>

          {/* Right booking widget */}
          <HeroBookingPanel />
        </div>
      </div>

    </section>
  );
};

export default Hero;

// Inline booking panel component to match reference layout
function HeroBookingPanel() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll({ includeInactive: false });
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) {
          setCategories([]);
        }
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategories = useMemo(() => {
    return categories
      .filter(category => category?.is_active)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        const labelA = resolveLocalizedValue(a.name, language);
        const labelB = resolveLocalizedValue(b.name, language);
        return labelA.localeCompare(labelB);
      });
  }, [categories, language]);

  useEffect(() => {
    setSelectedCategories(prev =>
      prev.filter(slug => activeCategories.some(category => category.slug === slug)),
    );
  }, [activeCategories]);

  const getCategoryLabel = (category: CategoryDto) => {
    const label = resolveLocalizedValue(category.name, language);
    if (label && label.trim().length > 0) {
      return label;
    }
    return category.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const allLabel = t('cars.filter.all');
  const isAllSelected = selectedCategories.length === 0;

  const handleToggleCategory = (slug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(slug)) {
        return prev.filter(value => value !== slug);
      }
      return Array.from(new Set([...prev, slug]));
    });
  };

  const handleSelectAll = () => {
    setSelectedCategories([]);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }
    if (pickupDate) {
      params.set('pickup', pickupDate);
    }
    if (returnDate) {
      params.set('dropoff', returnDate);
    }
    const query = params.toString();
    navigate(`/cars${query ? `?${query}` : ''}`);
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
      <h3 className="text-white font-semibold mb-4">{t('hero.booking.question')}</h3>
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-white/80 mb-2">{t('hero.booking.vehicleType')}</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className={`rounded-full border transition ${isAllSelected ? 'bg-gradient-primary text-white border-transparent shadow-lg' : 'bg-white/10 text-white/80 border-white/30 hover:bg-white/20'}`}
              onClick={handleSelectAll}
            >
              {allLabel !== 'cars.filter.all' ? allLabel : t('cars.filter.all')}
            </Button>
            {activeCategories.map(category => {
              const selected = selectedCategories.includes(category.slug);
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  className={`rounded-full border transition ${selected ? 'bg-gradient-primary text-white border-transparent shadow-lg' : 'bg-white/10 text-white/80 border-white/30 hover:bg-white/20'}`}
                  onClick={() => handleToggleCategory(category.slug)}
                >
                  {getCategoryLabel(category)}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">{t('hero.booking.pickupDate')}</label>
            <Flatpickr
              value={pickupDate || undefined}
              options={{
                dateFormat: 'Y-m-d',
                minDate: 'today',
                disableMobile: true,
              }}
              onChange={(dates, _dateStr, instance) => {
                const value = (dates && dates.length > 0) ? instance.formatDate(dates[0], 'Y-m-d') : null;
                setPickupDate(value);
                if (value && returnDate && value > returnDate) {
                  setReturnDate(value);
                }
              }}
              className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">{t('hero.booking.returnDate')}</label>
            <Flatpickr
              value={returnDate || undefined}
              options={{
                dateFormat: 'Y-m-d',
                minDate: pickupDate || 'today',
                disableMobile: true,
              }}
              onChange={(dates, _dateStr, instance) => {
                const value = (dates && dates.length > 0) ? instance.formatDate(dates[0], 'Y-m-d') : null;
                setReturnDate(value);
              }}
              className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white"
            />
          </div>
        </div>
        <Button
          onClick={handleSearch}
          className="w-full h-11 bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t('hero.booking.search')}
        </Button>
      </div>
    </div>
  );
}


