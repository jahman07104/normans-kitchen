import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { menuItems } from "@/lib/menu-data";
import {
  createOrder,
  readOrders,
  type OrderItemInput,
  type OrderRecord,
} from "@/lib/order-store";

type CreateOrderBody = {
  customerName?: string;
  customerPhone?: string;
  orderType?: "pickup" | "delivery";
  address?: string;
  notes?: string;
  items?: OrderItemInput[];
};

function isValidItem(item: OrderItemInput) {
  return (
    typeof item.menuItemId === "string" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load orders.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateOrderBody;

  if (!body.customerName || !body.customerPhone || !body.orderType) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Order must include at least one item." },
      { status: 400 },
    );
  }

  if (!body.items.every(isValidItem)) {
    return NextResponse.json(
      { error: "Invalid item payload." },
      { status: 400 },
    );
  }

  if (body.orderType === "delivery" && !body.address?.trim()) {
    return NextResponse.json(
      { error: "Delivery address is required." },
      { status: 400 },
    );
  }

  const computedItems: OrderRecord["items"] = [];

  for (const item of body.items) {
    const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);
    if (!menuItem || !menuItem.available) {
      return NextResponse.json(
        { error: `Item unavailable: ${item.menuItemId}` },
        { status: 400 },
      );
    }

    const lineTotal = Number((menuItem.price * item.quantity).toFixed(2));
    computedItems.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity: item.quantity,
      unitPrice: menuItem.price,
      lineTotal,
    });
  }

  const subtotal = Number(
    computedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2),
  );

  const order: OrderRecord = {
    id: randomUUID(),
    customerName: body.customerName.trim(),
    customerPhone: body.customerPhone.trim(),
    orderType: body.orderType,
    status: "new",
    address: body.orderType === "delivery" ? body.address?.trim() : undefined,
    notes: body.notes?.trim() || undefined,
    items: computedItems,
    subtotal,
    createdAt: new Date().toISOString(),
  };

  try {
    await createOrder(order);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 },
    );
  }
}
