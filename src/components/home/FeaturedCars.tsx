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
      id: 14,
      name: 'Hyundai i20',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1000',
      price: 45,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 15,
      name: 'Kia Picanto',
      category: 'economy',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000',
      price: 40,
      seats: 4,
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
      id: 16,
      name: 'Nissan Sentra',
      category: 'medium-sedan',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      price: 68,
      seats: 5,
      fuel: 'Petrol',
    },
    {
      id: 17,
      name: 'Honda Civic',
      category: 'medium-sedan',
      image: 'https://images.unsplash.com/photo-1552519507-88aa1e2c1c4d?q=80&w=1000',
      price: 72,
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
      id: 18,
      name: 'Mazda 6',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1549921296-3ecf4a8b7d3b?q=80&w=1000',
      price: 90,
      seats: 5,
      fuel: 'Petrol',
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
      id: 19,
      name: 'Audi A6',
      category: 'premium',
      image: 'https://images.unsplash.com/photo-1619767886899-30d87a9b75a1?q=80&w=1000',
      price: 170,
      seats: 5,
      fuel: 'Petrol',
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
      id: 20,
      name: 'Range Rover Sport',
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1619767886902-5ffbf8b5d4a7?q=80&w=1000',
      price: 250,
      seats: 5,
      fuel: 'Petrol',
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
      id: 21,
      name: 'Volkswagen Caravelle',
      category: 'minivan',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000',
      price: 170,
      seats: 8,
      fuel: 'Diesel',
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
      id: 22,
      name: 'BMW 7 Series',
      category: 'luxury',
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1000',
      price: 320,
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
    {
      id: 23,
      name: 'Isuzu Novo 27+1',
      category: 'big-bus',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1000',
      price: 450,
      seats: 28,
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
    <section className="py-20" style={{ backgroundColor: 'aliceblue' }}>
      <div className="container mx-auto px-4">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('cars.title')}
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-start gap-2 mt-8">
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
              <div className="relative w-full" style={{ aspectRatio: '16 / 9', minHeight: '220px' }}>
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* bottom gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                {/* car name overlay */}
                <div className="absolute left-3 bottom-3">
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow">{car.name}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {/* Gün */}
                  <div className="rounded-lg p-3 text-center bg-[#7b1020]">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-white mb-1">gün</div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">{car.price}</span>
                      <span className="text-sm font-semibold text-white/90">AZN</span>
                    </div>
                  </div>
                  {/* Həftə */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">həftə</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900">{car.price * 7}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
                  </div>
                  {/* Ay */}
                  <div className="rounded-lg p-3 text-center border border-border">
                    <div className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 mb-1">ay</div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-extrabold text-slate-900">{car.price * 30}</span>
                      <span className="text-xs font-semibold text-slate-700">AZN</span>
                    </div>
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
