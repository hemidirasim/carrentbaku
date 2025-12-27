import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LOCATION_LABELS = {
  baku: { az: 'Bakı', ru: 'Баку', en: 'Baku', ar: 'باكو' },
  ganja: { az: 'Gəncə', ru: 'Гянджа', en: 'Ganja', ar: 'كنجه' },
  sumqayit: { az: 'Sumqayıt', ru: 'Сумгаит', en: 'Sumqayit', ar: 'سومقاييت' },
  quba: { az: 'Quba', ru: 'Куба', en: 'Quba', ar: 'قوبا' },
  sheki: { az: 'Şəki', ru: 'Шеки', en: 'Sheki', ar: 'شاكي' },
} as const;

const CTASection = () => {
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState<Record<string, { temperature: number; windspeed: number; time: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    { key: 'baku', latitude: 40.4093, longitude: 49.8671 },
    { key: 'ganja', latitude: 40.6828, longitude: 46.3606 },
    { key: 'sumqayit', latitude: 40.5897, longitude: 49.6686 },
    { key: 'quba', latitude: 41.3611, longitude: 48.5122 },
    { key: 'sheki', latitude: 41.1919, longitude: 47.1705 },
  ];

  const getLocationName = (key: keyof typeof LOCATION_LABELS) => {
    const labelSet = LOCATION_LABELS[key];
    if (!labelSet) return key;
    return labelSet[language as keyof typeof labelSet] ?? labelSet.az;
  };

  useEffect(() => {
    let isCancelled = false;
    async function fetchWeather() {
      try {
        const results = await Promise.all(
          locations.map(async (loc) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`;
            const res = await fetch(url);
            const json = await res.json();
            return {
              key: loc.key,
              temperature: json?.current_weather?.temperature,
              windspeed: json?.current_weather?.windspeed,
              time: json?.current_weather?.time,
            } as { key: string; temperature: number; windspeed: number; time: string };
          })
        );
        if (!isCancelled) {
          const map: Record<string, { temperature: number; windspeed: number; time: string }> = {};
          results.forEach((r) => {
            if (r && typeof r.temperature === 'number') {
              map[r.key] = { temperature: r.temperature, windspeed: r.windspeed, time: r.time };
            }
          });
          setWeatherData(map);
        }
      } catch (e: any) {
        if (!isCancelled) setError(t('cta.weather.error'));
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchWeather();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1600')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0" style={{ backgroundColor: '#ffffffb0' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* CTA Content replaced with Weather Message */}
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl p-0 lg:p-0">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
                <span className="text-slate-900">{t('cta.weather.comprehensive.title.part1')}</span> <span className="text-accent">{t('cta.weather.comprehensive.title.part2')}</span>
              </h2>
              <p className="text-slate-800 text-lg font-semibold leading-relaxed mb-6">
                {t('cta.weather.comprehensive.subtitle')}
              </p>

              {/* Live Weather */}
              <div className="space-y-3">
                {loading && (
                  <div className="text-sm text-slate-600">{t('cta.weather.loading')}</div>
                )}
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}
                {!loading && !error && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {locations.map((loc) => {
                      const data = weatherData[loc.key];
                      return (
                        <div key={loc.key} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 bg-transparent">
                          <div className="text-slate-800 font-semibold">{getLocationName(loc.key as keyof typeof LOCATION_LABELS)}</div>
                          {data ? (
                            <div className="text-slate-700 text-sm">
                              <span className="font-bold text-slate-900">{Math.round(data.temperature)}°C</span>
                              <span className="ml-2 text-slate-600">{t('cta.weather.wind')} {Math.round(data.windspeed)} km/s</span>
                            </div>
                          ) : (
                            <div className="text-slate-500 text-sm">—</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-elegant ring-2 ring-white/20">
            <iframe
              src="https://www.google.com/maps?q=Azerbaijan&z=6&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%]"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
