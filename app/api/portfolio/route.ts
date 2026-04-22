import { getPortfolio, saveToPortfolio } from "@/lib/memory/history";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await getPortfolio();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { startupId?: string; weight?: number; note?: string };
  if (!body.startupId) {
    return NextResponse.json({ error: "startupId is required" }, { status: 400 });
  }

  await saveToPortfolio(body.startupId, body.weight ?? 10, body.note);
  return NextResponse.json({ ok: true });
}
