import { getAlerts } from "@/lib/memory/history";
import { NextResponse } from "next/server";

export async function GET() {
  const alerts = await getAlerts(20);
  return NextResponse.json({ alerts });
}
