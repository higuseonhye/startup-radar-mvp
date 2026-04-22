import { watcherAgent } from "@/lib/agents/watcherAgent";
import { NextResponse } from "next/server";

export async function POST() {
  const result = await watcherAgent();
  return NextResponse.json({ ...result, updatedAt: new Date().toISOString() });
}
