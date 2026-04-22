import { runDebate } from "@/lib/debate/runDebate";
import { getStartupById } from "@/lib/memory/history";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { startupId?: string };
  if (!body.startupId) {
    return NextResponse.json({ error: "startupId is required" }, { status: 400 });
  }

  const startup = await getStartupById(body.startupId);
  if (!startup) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const recentSignals = startup.signals.slice(-3);
  const analysis = await runDebate(startup, recentSignals);
  return NextResponse.json({ analysis });
}
