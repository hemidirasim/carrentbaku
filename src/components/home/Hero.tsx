import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background YouTube Video (cover) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundSize: '100%', backgroundRepeat: 'no-repeat', zIndex: 0 }}
        data-video-src="https://www.youtube.com/watch?v=5qbjKpxfD64"
      >
        <div className="w-full h-full relative">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
            src="https://www.youtube.com/embed/5qbjKpxfD64?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&playlist=5qbjKpxfD64&fs=0&disablekb=1"
            title="Hero Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
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
            <div className="text-accent font-semibold tracking-wide mb-2">Fast and Easy Way to Rent a Car</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              Explore the world with
              <br />
              comfortable car
            </h1>
            <p className="mt-6 text-white/90 text-lg max-w-xl">
              Embark on unforgettable adventures and discover the world in unparalleled comfort and style with our fleet of exceptionally comfortable cars.
            </p>
            <div className="mt-8">
              <Button 
                size="lg"
                onClick={() => navigate('/cars')}
                className="bg-accent hover:bg-accent-light text-white shadow-glow hover:shadow-elegant transition-all text-lg px-8 py-6 group"
              >
                {t('hero.selectCar')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
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
const vehicleTypes = [
  { id: 'car', label: 'Car' },
  { id: 'van', label: 'Van' },
  { id: 'minibus', label: 'Minibus' },
  { id: 'prestige', label: 'Prestige' },
];

function HeroBookingPanel() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState('car');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
      <h3 className="text-white font-semibold mb-4">What is your vehicle type?</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {vehicleTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setVehicle(t.id)}
            className={`rounded-xl py-4 text-center font-semibold transition-all ${
              vehicle === t.id
                ? 'bg-accent text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-white/80 mb-1">Pick Up Location</label>
          <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter your pickup location" className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white placeholder-white/60" />
        </div>
        <div>
          <label className="block text-sm text-white/80 mb-1">Drop Off Location</label>
          <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter your dropoff location" className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white placeholder-white/60" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="block text-sm text-white/80 mb-1">Pick Up Date</label>
            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Time</label>
            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-28 h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="block text-sm text-white/80 mb-1">Return Date</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-1">Time</label>
            <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-28 h-11 rounded-lg px-3 bg-white/10 border border-white/20 text-white" />
          </div>
        </div>
      </div>

      <Button onClick={() => navigate('/cars')} className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold">
        Find a Vehicle
      </Button>
    </div>
  );
}
