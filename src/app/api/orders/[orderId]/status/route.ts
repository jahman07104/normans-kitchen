import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionValue,
} from "@/lib/admin-auth";
import { updateOrderStatus, type OrderStatus } from "@/lib/order-store";

const allowedStatuses: OrderStatus[] = [
  "new",
  "in_kitchen",
  "ready",
  "delivered",
  "cancelled",
];

type StatusBody = {
  status?: OrderStatus;
};

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidAdminSessionValue(session);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { orderId } = await context.params;

  let body: StatusBody;
  try {
    body = (await req.json()) as StatusBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  try {
    await updateOrderStatus(orderId, body.status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
