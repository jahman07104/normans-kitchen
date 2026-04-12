import { PrismaClient, OrderStatus, OrderType } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password.trim(), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim() || "admin@normanskitchen.com";
  const password = process.env.SEED_ADMIN_PASSWORD?.trim() || "ChangeMeNow123!";

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hashPassword(password) },
    create: {
      email,
      passwordHash: hashPassword(password),
    },
  });

  return { email, password };
}

async function seedOrders() {
  const existing = await prisma.order.count();
  if (existing > 0) {
    return 0;
  }

  const now = Date.now();

  await prisma.order.create({
    data: {
      customerName: "A. Williams",
      customerPhone: "+1 404 555 9001",
      orderType: OrderType.pickup,
      status: OrderStatus.in_kitchen,
      subtotal: 31.0,
      createdAt: new Date(now - 1000 * 60 * 42),
      items: {
        create: [
          {
            menuItemId: "jerk-chicken",
            name: "Jerk Chicken",
            quantity: 1,
            unitPrice: 15.5,
            lineTotal: 15.5,
          },
          {
            menuItemId: "festival",
            name: "Festival",
            quantity: 2,
            unitPrice: 4.5,
            lineTotal: 9.0,
          },
          {
            menuItemId: "sorrel",
            name: "Sorrel Ginger",
            quantity: 1,
            unitPrice: 4.0,
            lineTotal: 4.0,
          },
          {
            menuItemId: "rice-and-peas",
            name: "Rice and Peas",
            quantity: 1,
            unitPrice: 2.5,
            lineTotal: 2.5,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customerName: "K. Brown",
      customerPhone: "+1 917 555 3322",
      orderType: OrderType.delivery,
      status: OrderStatus.ready,
      address: "128 Flatbush Ave, Brooklyn",
      subtotal: 45.0,
      createdAt: new Date(now - 1000 * 60 * 18),
      items: {
        create: [
          {
            menuItemId: "oxtail",
            name: "Braised Oxtail",
            quantity: 1,
            unitPrice: 21.0,
            lineTotal: 21.0,
          },
          {
            menuItemId: "rice-and-peas",
            name: "Rice and Peas",
            quantity: 2,
            unitPrice: 5.0,
            lineTotal: 10.0,
          },
          {
            menuItemId: "irish-moss",
            name: "Irish Moss",
            quantity: 2,
            unitPrice: 5.0,
            lineTotal: 10.0,
          },
          {
            menuItemId: "festival",
            name: "Festival",
            quantity: 1,
            unitPrice: 4.0,
            lineTotal: 4.0,
          },
        ],
      },
    },
  });

  return 2;
}

async function main() {
  const admin = await seedAdmin();
  const seededOrders = await seedOrders();

  console.log(`Seeded admin email: ${admin.email}`);
  console.log(`Seeded admin password: ${admin.password}`);
  console.log(`Orders seeded: ${seededOrders}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
