import { promises as fs } from "fs";
import path from "path";

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

const ordersPath = path.join(process.cwd(), "data", "orders.json");

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
  const existing = await readOrders();
  const updated = [order, ...existing];
  await writeOrders(updated);
}
