import { NextResponse } from "next/server";
import { blockDate, listBlockedDates, unblockDate } from "@/lib/store";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function readDate(req: Request): Promise<string | null> {
  const body = (await req.json().catch(() => ({}))) as { date?: unknown };
  const date = typeof body.date === "string" ? body.date : "";
  return DATE_RE.test(date) ? date : null;
}

export async function GET() {
  return NextResponse.json({ dates: listBlockedDates() });
}

export async function POST(req: Request) {
  const date = await readDate(req);
  if (!date) {
    return NextResponse.json({ error: "Invalid date (expected YYYY-MM-DD)" }, { status: 400 });
  }
  blockDate(date);
  return NextResponse.json({ dates: listBlockedDates() }, { status: 201 });
}

export async function DELETE(req: Request) {
  const date = await readDate(req);
  if (!date) {
    return NextResponse.json({ error: "Invalid date (expected YYYY-MM-DD)" }, { status: 400 });
  }
  unblockDate(date);
  return NextResponse.json({ dates: listBlockedDates() });
}
