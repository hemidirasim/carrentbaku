import { prisma } from "../src/lib/prisma";

const ECONOMIC_CARS = [
  {
    brand: "Chevrolet",
    model: "Cobalt",
    year: 2023,
    category: "econom",
    price_per_day: 55,
    price_per_week: 380,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Accent",
    year: 2016,
    category: "econom",
    price_per_day: 50,
    price_per_week: 350,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2016,
    category: "econom",
    price_per_day: 55,
    price_per_week: 385,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2019,
    category: "econom",
    price_per_day: 60,
    price_per_week: 420,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Kia",
    model: "Cerato",
    year: 2016,
    category: "econom",
    price_per_day: 55,
    price_per_week: 385,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Kia",
    model: "Cerato",
    year: 2019,
    category: "econom",
    price_per_day: 60,
    price_per_week: 420,
    fuel_type: "Benzin",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Fuel: Benzin", "5 seats"],
  },
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2025,
    category: "econom",
    price_per_day: 80,
    price_per_week: 550,
    fuel_type: "Hybrid",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Hybrid", "5 seats"],
  },
  {
    brand: "Hyundai",
    model: "Elantra",
    year: 2024,
    category: "econom",
    price_per_day: 80,
    price_per_week: 550,
    fuel_type: "Hybrid",
    transmission: "Auto",
    seats: 5,
    image_url: "https://new.carrentbaku.az/placeholder.svg",
    features: ["Automatic transmission", "Hybrid", "5 seats"],
  },
];

(async () => {
  for (const car of ECONOMIC_CARS) {
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
        data: car,
      });
      console.log(`Updated ${car.brand} ${car.model} ${car.year}`);
    } else {
      await prisma.car.create({ data: car });
      console.log(`Created ${car.brand} ${car.model} ${car.year}`);
    }
  }

  await prisma.$disconnect();
})();
