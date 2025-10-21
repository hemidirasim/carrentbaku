import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Fuel, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import ReservationDialog from '@/components/ReservationDialog';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string>('');

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
      id: 2,
      name: 'Toyota Camry',
      category: 'comfort',
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
      category: 'comfort',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      price: 80,
      seats: 5,
      fuel: 'Petrol',
    },
  ];

  const categories = [
    { id: 'all', label: t('cars.filter.all') },
    { id: 'economy', label: t('cars.filter.economy') },
    { id: 'comfort', label: t('cars.filter.comfort') },
    { id: 'premium', label: t('cars.filter.premium') },
  ];

  const filteredCars = selectedCategory === 'all' 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCars.map((car) => (
            <Card 
              key={car.id}
              className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge 
                  className="absolute top-4 right-4 bg-accent text-accent-foreground"
                >
                  {car.category}
                </Badge>
              </div>
              
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{car.seats}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fuel className="w-4 h-4" />
                    <span>{car.fuel}</span>
                  </div>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-primary">{car.price}</span>
                  <span className="text-muted-foreground">AZN / {t('cars.perDay')}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => {
                    setSelectedCar(car.name);
                    setIsReservationOpen(true);
                  }}
                  className="w-full bg-gradient-primary group"
                >
                  {t('nav.reserve')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/cars">
            <Button size="lg" variant="outline" className="group">
              {t('cars.viewAll')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <ReservationDialog 
          open={isReservationOpen} 
          onOpenChange={setIsReservationOpen}
          carName={selectedCar}
        />
      </div>
    </section>
  );
};

export default FeaturedCars;
