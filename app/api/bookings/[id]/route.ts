import { NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/store";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = (await req.json()) as { status: BookingStatus };
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = updateBookingStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ booking: updated });
}
