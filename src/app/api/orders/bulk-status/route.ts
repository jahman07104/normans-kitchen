import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionValue,
} from "@/lib/admin-auth";
import { updateOrderStatuses, type OrderStatus } from "@/lib/order-store";

const allowedStatuses: OrderStatus[] = [
  "new",
  "in_kitchen",
  "ready",
  "delivered",
  "cancelled",
];

type BulkStatusBody = {
  orderIds?: string[];
  status?: OrderStatus;
};

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidAdminSessionValue(session);
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: BulkStatusBody;

  try {
    body = (await req.json()) as BulkStatusBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.status || !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }

  if (!Array.isArray(body.orderIds) || body.orderIds.length === 0) {
    return NextResponse.json({ error: "No orders selected." }, { status: 400 });
  }

  const sanitizedIds = body.orderIds
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (sanitizedIds.length === 0) {
    return NextResponse.json({ error: "No valid order IDs." }, { status: 400 });
  }

  const updatedCount = await updateOrderStatuses(sanitizedIds, body.status);
  return NextResponse.json({ ok: true, updatedCount });
}
