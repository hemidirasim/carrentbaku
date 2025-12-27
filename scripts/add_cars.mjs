import { prisma } from '../src/lib/prisma';

const cars = [
  {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    category: 'econom',
    categories: ['econom'],
    price_per_day: 55,
    price_per_week: 350,
    price_per_month: 1200,
    fuel_type: 'petrol',
    transmission: 'automatic',
    seats: 5,
    image_url: JSON.stringify(['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200']),
  },
  {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    category: 'suv',
    categories: ['suv'],
    price_per_day: 85,
    price_per_week: 520,
    price_per_month: 1650,
    fuel_type: 'petrol',
    transmission: 'automatic',
    seats: 5,
    image_url: JSON.stringify(['https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200']),
  },
  {
    brand: 'Mercedes-Benz',
    model: 'V-Class',
    year: 2021,
    category: 'minivan',
    categories: ['minivan'],
    price_per_day: 120,
    price_per_week: 780,
    price_per_month: 2400,
    fuel_type: 'diesel',
    transmission: 'automatic',
    seats: 7,
    image_url: JSON.stringify(['https://images.unsplash.com/photo-1610465299997-f6bfd9ef7c68?q=80&w=1200']),
  },
];

async function main() {
  try {
    for (const car of cars) {
      await prisma.car.upsert({
        where: {
          brand_model_year: {
            brand: car.brand,
            model: car.model,
            year: car.year,
          },
        },
        update: car,
        create: car,
      });
    }
    console.log('Cars seeded successfully');
  } catch (error) {
    console.error('Failed to seed cars:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
