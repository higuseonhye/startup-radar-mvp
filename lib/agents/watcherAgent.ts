import { buildAlert, sendWebhookAlert } from "@/lib/alerts/notifier";
import { detectChange } from "@/lib/agents/changeDetector";
import { runDebate } from "@/lib/debate/runDebate";
import { readState, writeState } from "@/lib/memory/store";
import { ingestSignals } from "@/lib/pipeline/ingest";
import { normalizeSignals } from "@/lib/pipeline/normalize";
import { AlertRecord } from "@/lib/types";

export async function watcherAgent() {
  const state = await readState();
  const updates: Array<{ startupId: string; name: string; prev: number; next: number; changed: boolean }> = [];
  const newAlerts: AlertRecord[] = [];

  for (const startup of state.startups) {
    const incomingSignals = normalizeSignals(ingestSignals(startup.id));
    startup.signals.push(...incomingSignals);

    const debate = await runDebate(startup, incomingSignals);
    const previousAnalysis = startup.analyses[startup.analyses.length - 1];
    const previousScore = previousAnalysis?.aliveScore ?? debate.aliveScore;

    startup.analyses.push({
      aliveScore: debate.aliveScore,
      dimensions: debate.dimensions,
      insight: debate.insight,
      debateLog: debate.debateLog,
      confidence: debate.confidence,
      confidenceBreakdown: debate.confidenceBreakdown,
      caveats: debate.caveats,
      createdAt: new Date().toISOString(),
    });

    const reason =
      debate.aliveScore >= previousScore
        ? "Signal momentum improved"
        : "Risk signals increased";
    const evidence = incomingSignals.map((signal) => signal.content).join(" | ");
    const change = detectChange(startup.id, previousScore, debate.aliveScore, reason, evidence);

    if (change) {
      startup.changes.push(change);
      const alert = buildAlert({ startup, change });
      state.alerts.unshift(alert);
      newAlerts.push(alert);
      await sendWebhookAlert(alert);
    }

    updates.push({
      startupId: startup.id,
      name: startup.name,
      prev: previousScore,
      next: debate.aliveScore,
      changed: Boolean(change),
    });
  }

  state.alerts = state.alerts.slice(0, 50);
  await writeState(state);
  return { updates, alerts: newAlerts };
}
