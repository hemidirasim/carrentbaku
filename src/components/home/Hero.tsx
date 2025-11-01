import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-10 sm:pt-0 sm:pb-0">
      {/* Background YouTube Video (cover) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundSize: '100%', backgroundRepeat: 'no-repeat', zIndex: 0 }}
        data-video-src="https://www.youtube.com/watch?v=5qbjKpxfD64"
      >
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

      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse z-[1]" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left text */}
          <div className="text-left max-w-2xl">
            <div className="text-accent font-semibold tracking-wide mb-2">{t('hero.tagline')}</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              {t('hero.headline.part1')}
              <br />
              {t('hero.headline.part2')}
            </h1>
            <p className="mt-6 text-white/90 text-lg max-w-xl">
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState('car');
  const [pickup, setPickup] = useState('office');
  const [dropoff, setDropoff] = useState('office');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const vehicleTypes = [
    { id: 'car', label: t('hero.booking.vehicle.car') },
    { id: 'van', label: t('hero.booking.vehicle.van') },
    { id: 'minibus', label: t('hero.booking.vehicle.minibus') },
    { id: 'prestige', label: t('hero.booking.vehicle.prestige') },
  ];

  const locationOptions = [
    { value: 'office', label: t('hero.booking.location.office') },
    { value: 'airport', label: t('hero.booking.location.airport') },
    { value: 'hotel', label: t('hero.booking.location.hotel') },
  ];

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
      <h3 className="text-white font-semibold mb-4">{t('hero.booking.question')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {vehicleTypes.map((vt) => (
          <button
            key={vt.id}
            onClick={() => setVehicle(vt.id)}
            className={`rounded-xl py-4 text-center font-semibold transition-all ${
              vehicle === vt.id
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {vt.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-white/80 mb-1">{t('hero.booking.pickupLocation')}</label>
          <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white">
            {locationOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-1">{t('hero.booking.dropoffLocation')}</label>
          <select value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white">
            {locationOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-white/80 mb-1">{t('hero.booking.pickupDate')}</label>
          <input 
            type="date" 
            value={pickupDate} 
            onChange={(e) => {
              setPickupDate(e.target.value);
              if (returnDate && e.target.value > returnDate) {
                setReturnDate(e.target.value);
              }
            }}
            className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" 
          />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-1">{t('hero.booking.returnDate')}</label>
          <input 
            type="date" 
            value={returnDate} 
            onChange={(e) => setReturnDate(e.target.value)}
            min={pickupDate || undefined}
            className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" 
          />
        </div>
      </div>

      <Button onClick={() => navigate('/cars')} className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold">
        {t('hero.selectCar')}
      </Button>
    </div>
  );
}
