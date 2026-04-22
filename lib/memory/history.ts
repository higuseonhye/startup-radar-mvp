import { readState, writeState } from "@/lib/memory/store";

export async function getFeedItems() {
  const state = await readState();

  return state.startups.map((startup) => {
    const latest = startup.analyses[startup.analyses.length - 1];
    const latestChange = startup.changes[startup.changes.length - 1];

    return {
      id: startup.id,
      name: startup.name,
      description: startup.description,
      sector: startup.sector,
      stage: startup.stage,
      aliveScore: latest?.aliveScore ?? 0,
      confidence: latest?.confidence ?? 0,
      confidenceLabel: latest?.confidenceBreakdown?.signalStrength ?? "low",
      caveat: latest?.caveats?.[0] ?? "Current view may shift as new signals arrive.",
      insight: latest?.insight ?? "No analysis yet.",
      updatedAt: latest?.createdAt ?? startup.signals[startup.signals.length - 1]?.createdAt ?? new Date().toISOString(),
      latestChange,
    };
  });
}

export async function getStartupById(id: string) {
  const state = await readState();
  return state.startups.find((startup) => startup.id === id) ?? null;
}

export async function saveToPortfolio(startupId: string, weight: number, note?: string) {
  const state = await readState();
  const existing = state.portfolio.find((item) => item.startupId === startupId);

  if (existing) {
    existing.weight = weight;
    existing.note = note;
  } else {
    state.portfolio.push({
      startupId,
      weight,
      note,
      createdAt: new Date().toISOString(),
    });
  }

  await writeState(state);
}

export async function getPortfolio() {
  const state = await readState();

  const items = state.portfolio.map((item) => {
    const startup = state.startups.find((entry) => entry.id === item.startupId);
    const latest = startup?.analyses[startup.analyses.length - 1];
    const latestChange = startup?.changes[startup.changes.length - 1];

    const action =
      latestChange && latestChange.newScore < latestChange.prevScore
        ? "Reduce exposure by 2-3%"
        : latestChange && latestChange.newScore > latestChange.prevScore
          ? "Increase conviction gradually"
          : "Watch closely";

    return {
      ...item,
      startupName: startup?.name ?? item.startupId,
      aliveScore: latest?.aliveScore ?? 0,
      action,
    };
  });

  return items;
}

export async function getAlerts(limit = 10) {
  const state = await readState();
  return state.alerts.slice(0, limit);
}
