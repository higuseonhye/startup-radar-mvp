import { getFeedItems } from "@/lib/memory/history";
import { NextResponse } from "next/server";

export async function GET() {
  const feed = await getFeedItems();
  return NextResponse.json({ feed });
}
