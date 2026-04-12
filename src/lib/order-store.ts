import { OrderStatus as PrismaOrderStatus, OrderType as PrismaOrderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type OrderType = "pickup" | "delivery";
export type OrderStatus = "new" | "in_kitchen" | "ready" | "delivered" | "cancelled";

export type OrderItemInput = {
  menuItemId: string;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  status: OrderStatus;
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

type ReadOrdersOptions = {
  status?: OrderStatus;
};

function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Configure PostgreSQL in .env.local.");
  }
}

export async function readOrders(options?: ReadOrdersOptions): Promise<OrderRecord[]> {
  requireDatabaseUrl();
  const dbOrders = await prisma.order.findMany({
    where: options?.status ? { status: options.status as PrismaOrderStatus } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return dbOrders.map((order) => ({
    id: order.publicId,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    orderType: order.orderType,
    status: order.status,
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

export async function createOrder(order: OrderRecord): Promise<void> {
  requireDatabaseUrl();
  await prisma.order.create({
    data: {
      publicId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      orderType: order.orderType as PrismaOrderType,
      status: order.status as PrismaOrderStatus,
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
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  requireDatabaseUrl();
  await prisma.order.update({
    where: { publicId: orderId },
    data: { status: status as PrismaOrderStatus },
  });
}
