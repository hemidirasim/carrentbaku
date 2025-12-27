import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const cars = [
  {
    brand: "Chevrolet",
    model: "Cobalt",
    year: 2023,
    price_per_day: 55,
    price_per_week: 380,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Accent",
    year: 2014,
    price_per_day: 50,
    price_per_week: 350,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2015,
    price_per_day: 55,
    price_per_week: 385,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2019,
    price_per_day: 60,
    price_per_week: 420,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Kia",
    model: "Cerato",
    year: 2015,
    price_per_day: 55,
    price_per_week: 385,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Kia",
    model: "Cerato",
    year: 2019,
    price_per_day: 60,
    price_per_week: 420,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2025,
    price_per_day: 80,
    price_per_week: 550,
    fuel_type: "Hybrid",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Hybrid", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2024,
    price_per_day: 80,
    price_per_week: 550,
    fuel_type: "Hybrid",
    transmission: "Auto",
    seats: 5,
    category: "econom",
    categories: ["econom"],
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Hybrid", "5 seats"],
  },
];

async function main() {
  for (const car of cars) {
    const existing = await prisma.car.findFirst({
      where: {
        brand: car.brand,
        model: car.model,
        year: car.year,
      },
    });

    if (existing) {
      await prisma.car.update({
        where: { id: existing.id },
        data: {
          price_per_day: car.price_per_day,
          price_per_week: car.price_per_week,
          price_per_month: null,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          seats: car.seats,
          category: car.category,
          categories: car.categories,
          image_url: car.image_url,
          features: car.features,
          available: true,
        },
      });
      console.log(`Updated ${car.brand} ${car.model} ${car.year}`);
    } else {
      await prisma.car.create({
        data: {
          id: randomUUID(),
          brand: car.brand,
          model: car.model,
          year: car.year,
          price_per_day: car.price_per_day,
          price_per_week: car.price_per_week,
          price_per_month: null,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          seats: car.seats,
          category: car.category,
          categories: car.categories,
          image_url: car.image_url,
          features: car.features,
          available: true,
        },
      });
      console.log(`Created ${car.brand} ${car.model} ${car.year}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
