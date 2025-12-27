import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const cars = [
  { brand: "Hyundai", model: "H1", year: 2022, price_per_day: 140, price_per_week: 910, seats: 8, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Mercedes-Benz", model: "Viano", year: 2013, price_per_day: 200, price_per_week: 1300, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Mercedes-Benz", model: "V Class", year: 2020, price_per_day: 250, price_per_week: 1600, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
];

const defaultData = {
  category: "minivan",
  categories: ["minivan"],
  image_url: "https://new.carrentbaku.az/placeholder.svg",
  features: ["Automatic transmission", "Fuel: Benzin", "Minivan comfort"],
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
      const mergedCategories = Array.from(new Set([...existingCategories, "minivan"]));
      await prisma.car.update({
        where: { id: existing.id },
        data: {
          price_per_day: car.price_per_day,
          price_per_week: car.price_per_week,
          seats: car.seats,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          category: mergedCategories[0] || "minivan",
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
