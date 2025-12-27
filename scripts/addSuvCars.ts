import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const cars = [
  { brand: "Kia", model: "Sportage", year: 2016, price_per_day: 75, price_per_week: 525, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Kia", model: "Sportage", year: 2024, price_per_day: 120, price_per_week: 800, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Hyundai", model: "IX35", year: 2016, price_per_day: 70, price_per_week: 470, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Hyundai", model: "Tucson", year: 2021, price_per_day: 85, price_per_week: 570, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Kia", model: "Sorento", year: 2023, price_per_day: 150, price_per_week: 1100, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Hyundai", model: "Santa Fe", year: 2023, price_per_day: 140, price_per_week: 900, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Mitsubishi", model: "Pajero", year: 2016, price_per_day: 85, price_per_week: 580, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Toyota", model: "Prado", year: 2018, price_per_day: 120, price_per_week: 800, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Toyota", model: "Land Cruiser", year: 2015, price_per_day: 170, price_per_week: 1120, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Toyota", model: "Land Cruiser", year: 2018, price_per_day: 400, price_per_week: 2700, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Toyota", model: "Land Cruiser", year: 2024, price_per_day: 400, price_per_week: 2700, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Lexus", model: "LX 570", year: 2014, price_per_day: 250, price_per_week: 1700, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Mercedes-Benz", model: "GLS", year: 2020, price_per_day: 350, price_per_week: 2400, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "BMW", model: "X5", year: 2022, price_per_day: 350, price_per_week: 2400, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "BMW", model: "X7", year: 2022, price_per_day: 400, price_per_week: 2700, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Range Rover", model: "Vogue", year: 2022, price_per_day: 350, price_per_week: 2300, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Kia", model: "X-line", year: 2023, price_per_day: 70, price_per_week: 490, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Hyundai", model: "Creta", year: 2020, price_per_day: 75, price_per_week: 525, seats: 5, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Mitsubishi", model: "Pajero Sport", year: 2024, price_per_day: 140, price_per_week: 910, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
  { brand: "Lexus", model: "LX 600", year: 2024, price_per_day: 1400, price_per_week: 9100, seats: 7, fuel_type: "Benzin", transmission: "Auto" },
];

const defaultData = {
  category: "suv",
  categories: ["suv"],
  image_url: "https://new.carrentbaku.az/placeholder.svg",
  features: ["Automatic transmission", "Fuel: Benzin", "SUV comfort"],
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
      const mergedCategories = Array.from(new Set([...existingCategories, "suv"]));
      await prisma.car.update({
        where: { id: existing.id },
        data: {
          price_per_day: car.price_per_day,
          price_per_week: car.price_per_week,
          seats: car.seats,
          fuel_type: car.fuel_type,
          transmission: car.transmission,
          category: mergedCategories[0] || "suv",
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
