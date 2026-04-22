import { promises as fs } from "node:fs";
import path from "node:path";
import { RadarState } from "@/lib/types";

const statePath = path.join(process.cwd(), "data", "state.json");

export async function readState(): Promise<RadarState> {
  const raw = await fs.readFile(statePath, "utf-8");
  const parsed = JSON.parse(raw) as Partial<RadarState>;
  return {
    startups: parsed.startups ?? [],
    portfolio: parsed.portfolio ?? [],
    alerts: parsed.alerts ?? [],
    updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
  };
}

export async function writeState(state: RadarState): Promise<void> {
  const updated = { ...state, updatedAt: new Date().toISOString() };
  await fs.writeFile(statePath, JSON.stringify(updated, null, 2), "utf-8");
}
