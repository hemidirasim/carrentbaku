import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Fuel, Calendar, DollarSign, Shield, ChevronLeft, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReservationDialog from '@/components/ReservationDialog';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [reservationOpen, setReservationOpen] = useState(false);

  // Mock data - in production, this would come from an API
  const cars = [
    {
      id: 1,
      name: 'Hyundai Elantra',
      category: 'economy',
      brand: 'Hyundai',
      images: [
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1000',
        'https://images.unsplash.com/photo-1619767886463-eca0bc90544a?q=80&w=1000',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=800',
      ],
      price: 55,
      deposit: 200,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'GPS Navigation', 'USB Port', 'Backup Camera'],
    },
    {
      id: 2,
      name: 'Toyota Camry',
      category: 'comfort',
      brand: 'Toyota',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800',
      ],
      price: 85,
      deposit: 300,
      seats: 5,
      fuel: 'Hybrid',
      year: 2023,
      features: ['Leather Seats', 'Sunroof', 'Bluetooth', 'Air Conditioning', 'GPS Navigation', 'Parking Sensors'],
    },
    {
      id: 3,
      name: 'Mercedes E-Class',
      category: 'premium',
      brand: 'Mercedes-Benz',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
      ],
      price: 150,
      deposit: 500,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Premium Leather', 'Panoramic Sunroof', 'Advanced Safety', 'Premium Sound', 'Heated Seats', 'Ambient Lighting'],
    },
    {
      id: 4,
      name: 'Kia Rio',
      category: 'economy',
      brand: 'Kia',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
      ],
      price: 50,
      deposit: 180,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'USB Port'],
    },
    {
      id: 5,
      name: 'BMW 5 Series',
      category: 'premium',
      brand: 'BMW',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000',
      ],
      price: 180,
      deposit: 550,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Sport Package', 'Premium Sound', 'Adaptive Cruise', 'Lane Assist', 'Parking Assistant'],
    },
    {
      id: 6,
      name: 'Honda Accord',
      category: 'comfort',
      brand: 'Honda',
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000',
      ],
      price: 80,
      deposit: 280,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Sunroof', 'Air Conditioning', 'GPS Navigation'],
    },
    {
      id: 7,
      name: 'Nissan Sentra',
      category: 'economy',
      brand: 'Nissan',
      images: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000',
      ],
      price: 60,
      deposit: 220,
      seats: 5,
      fuel: 'Petrol',
      year: 2023,
      features: ['Bluetooth', 'Air Conditioning', 'USB Port', 'Backup Camera'],
    },
    {
      id: 8,
      name: 'Audi A6',
      category: 'premium',
      brand: 'Audi',
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000',
      ],
      price: 170,
      deposit: 520,
      seats: 5,
      fuel: 'Diesel',
      year: 2024,
      features: ['Virtual Cockpit', 'Matrix LED', 'Premium Sound', 'Adaptive Suspension', 'Massage Seats'],
    },
  ];

  const car = cars.find(c => c.id === Number(id));

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Avtomobil tapılmadı</h2>
          <Button onClick={() => navigate('/cars')}>Avtomobillərə qayıt</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-primary py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/cars')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('cars.viewAll')}
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {car.name}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '2.5 / 1', minHeight: '300px' }}>
                <img
                  src={car.images[selectedImage]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  {car.year}
                </Badge>
              </div>
              
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt={`${car.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t('detail.specs')}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('detail.seats')}</p>
                        <p className="font-semibold">{car.seats}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('detail.year')}</p>
                        <p className="font-semibold">{car.year}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('detail.fuel')}</p>
                        <p className="font-semibold">{car.fuel}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('detail.deposit')}</p>
                        <p className="font-semibold">{car.deposit} AZN</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('detail.price')}</p>
                        <div className="flex flex-col">
                          <span className="text-4xl font-bold text-primary">{car.price}</span>
                          <span className="text-sm text-muted-foreground">AZN / {t('cars.perDay')}</span>
                        </div>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary" />
                    </div>

                    <Button 
                      className="w-full bg-gradient-primary text-lg py-6"
                      onClick={() => setReservationOpen(true)}
                    >
                      {t('detail.reserve')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">{t('detail.features')}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <ReservationDialog
        open={reservationOpen}
        onOpenChange={setReservationOpen}
        carName={car.name}
      />
    </div>
  );
};

export default CarDetail;
