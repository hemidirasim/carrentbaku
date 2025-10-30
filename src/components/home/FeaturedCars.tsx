import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  fuel: string;
}

const FeaturedCars = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('economy');

  const cars: Car[] = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
      price: 55,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 11,
      name: 'Toyota Corolla',
      category: 'medium-sedan',
      image: 'https://images.unsplash.com/photo-1617817647345-bb19fff15db7?q=80&w=1000',
      price: 70,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 2,
      name: 'Toyota Camry',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
      price: 85,
      seats: 5,
      fuel: 'Hybrid',
    },
    {
      id: 3,
      name: 'Mercedes E-Class',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
      price: 150,
      seats: 5,
      fuel: 'Diesel',
    },
    {
      id: 4,
      name: 'Kia Rio',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
      price: 50,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 5,
      name: 'BMW 5 Series',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      price: 180,
      seats: 5,
      fuel: 'Diesel',
    },
    {
      id: 6,
      name: 'Honda Accord',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      price: 80,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 7,
      name: 'Toyota Land Cruiser',
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
      price: 120,
      seats: 7,
      fuel: 'Diesel',
    },
    {
      id: 8,
      name: 'BMW X5',
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      price: 200,
      seats: 5,
      fuel: 'Diesel',
    },
    {
      id: 9,
      name: 'Mercedes V-Class',
      category: 'minivan',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000',
      price: 180,
      seats: 8,
      fuel: 'Diesel',
    },
    {
      id: 10,
      name: 'Toyota Alphard',
      category: 'minivan',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000',
      price: 160,
      seats: 7,
      fuel: 'Petrol',
    },
    {
      id: 12,
      name: 'Mercedes S-Class',
      category: 'luxury',
      image: 'https://images.unsplash.com/photo-1596995804697-5d4f4a5d1a96?q=80&w=1000',
      price: 350,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 13,
      name: 'Mercedes Sprinter 20+1',
      category: 'big-bus',
      image: 'https://images.unsplash.com/photo-1610395219791-f9bc5f3867be?q=80&w=1000',
      price: 400,
      seats: 21,
      fuel: 'Diesel',
    },
  ];

  const categories = [
    { id: 'economy', label: 'Ekonom' },
    { id: 'medium-sedan', label: 'Medium Sedan' },
    { id: 'business', label: 'Biznes' },
    { id: 'premium', label: 'Premium' },
    { id: 'suv', label: 'SUV' },
    { id: 'minivan', label: 'Minivan' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'big-bus', label: 'Big Bus' },
  ];

  const filteredCars = cars.filter(car => car.category === selectedCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cars.title')}
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-gradient-primary' : ''}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {filteredCars.map((car) => (
            <Card 
              key={car.id}
              className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {/* Gün */}
                  <div className="rounded-lg p-3 text-center bg-blue-100">
                    <div className="text-[10px] uppercase tracking-wide text-slate-700 mb-1">gün</div>
                    <div className="text-2xl font-bold text-slate-900">{car.price}<span className="text-sm font-semibold ml-1">AZN</span></div>
                  </div>
                  {/* Həftə */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-[10px] uppercase tracking-wide text-slate-600 mb-1">həftə</div>
                    <div className="text-xl font-bold text-slate-900">{car.price * 7}<span className="text-xs font-semibold ml-1">AZN</span></div>
                  </div>
                  {/* Ay + Endirim */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-[10px] uppercase tracking-wide text-slate-600 mb-1">ay</div>
                    {(() => {
                      const original = car.price * 30;
                      const discounted = Math.round(original * 0.85);
                      return (
                        <div>
                          <div className="text-[11px] text-slate-500 line-through">{original} AZN</div>
                          <div className="text-xl font-extrabold text-slate-900">{discounted}<span className="text-xs font-semibold ml-1">AZN</span></div>
                          <div className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">15% endirim</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom button removed previously; keeping section minimal with prices only */}
      </div>
    </section>
  );
};

export default FeaturedCars;
