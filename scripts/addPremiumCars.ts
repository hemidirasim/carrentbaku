import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const cars = [
  {
    brand: "BMW",
    model: "530",
    year: 2021,
    price_per_day: 350,
    price_per_week: 2300,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Mercedes-Benz",
    model: "S Class",
    year: 2019,
    price_per_day: 300,
    price_per_week: 1950,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Mercedes-Benz",
    model: "S Class",
    year: 2024,
    price_per_day: 1500,
    price_per_week: 9100,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Ford",
    model: "Mustang",
    year: 2022,
    price_per_day: 250,
    price_per_week: 1500,
    seats: 2,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Toyota",
    model: "Land Cruiser",
    year: 2024,
    price_per_day: 300,
    price_per_week: 2000,
    seats: 7,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Lexus",
    model: "LX 600",
    year: 2024,
    price_per_day: 1400,
    price_per_week: 9100,
    seats: 7,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Mercedes-Benz",
    model: "E Class",
    year: 2020,
    price_per_day: 250,
    price_per_week: 1500,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Range Rover",
    model: "Vogue",
    year: 2022,
    price_per_day: 350,
    price_per_week: 2300,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "Mercedes-Benz",
    model: "GLS",
    year: 2023,
    price_per_day: 350,
    price_per_week: 2400,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "BMW",
    model: "X5",
    year: 2022,
    price_per_day: 350,
    price_per_week: 2400,
    seats: 5,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
  {
    brand: "BMW",
    model: "X7",
    year: 2022,
    price_per_day: 400,
    price_per_week: 2700,
    seats: 7,
    fuel_type: "Benzin",
    transmission: "Auto",
  },
];

const defaultData = {
  category: "luxury",
  categories: ["luxury"],
  image_url: "https://new.carrentbaku.az/placeholder.svg",
  features: ["Automatic transmission", "Fuel: Benzin", "Premium comfort"],
  available: true,
};

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
      const existingCategories = Array.isArray(existing.categories) ? existing.categories : [];
      const mergedCategories = Array.from(new Set([...existingCategories, "luxury"]));
      await prisma.car.update({
        where: { id: existing.id },
        data: {
          price_per_day: car.price_per_day,
          price_per_week: car.price_per_week,
          seats: car.seats,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          category: "luxury",
          categories: mergedCategories,
          image_url: existing.image_url || defaultData.image_url,
          features: existing.features && existing.features.length ? existing.features : defaultData.features,
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
          seats: car.seats,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          ...defaultData,
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
