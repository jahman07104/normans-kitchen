import { promises as fs } from "fs";
import path from "path";
import { OrderType as PrismaOrderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type OrderType = "pickup" | "delivery";

export type OrderItemInput = {
  menuItemId: string;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  address?: string;
  notes?: string;
  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  createdAt: string;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  address?: string;
  notes?: string;
  items: OrderRecord["items"];
  subtotal: number;
};

const ordersPath = path.join(process.cwd(), "data", "orders.json");

function isDatabaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

async function ensureStoreExists() {
  const dirPath = path.dirname(ordersPath);
  await fs.mkdir(dirPath, { recursive: true });

  try {
    await fs.access(ordersPath);
  } catch {
    await fs.writeFile(ordersPath, "[]\n", "utf-8");
  }
}

export async function readOrders(): Promise<OrderRecord[]> {
  if (isDatabaseEnabled()) {
    const dbOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return dbOrders.map((order) => ({
      id: order.publicId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      orderType: order.orderType,
      address: order.address ?? undefined,
      notes: order.notes ?? undefined,
      subtotal: Number(order.subtotal),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal),
      })),
    }));
  }

  await ensureStoreExists();
  const raw = await fs.readFile(ordersPath, "utf-8");

  try {
    const parsed = JSON.parse(raw) as OrderRecord[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export async function writeOrders(orders: OrderRecord[]): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(
    ordersPath,
    `${JSON.stringify(orders, null, 2)}\n`,
    "utf-8",
  );
}

export async function createOrder(order: OrderRecord): Promise<void> {
  if (isDatabaseEnabled()) {
    await prisma.order.create({
      data: {
        publicId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.orderType as PrismaOrderType,
        address: order.address,
        notes: order.notes,
        subtotal: order.subtotal,
        createdAt: new Date(order.createdAt),
        items: {
          create: order.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
    });
    return;
  }

  const existing = await readOrders();
  const updated = [order, ...existing];
  await writeOrders(updated);
}
