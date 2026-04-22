import { SignalRecord, StartupRecord } from "@/lib/types";
import { ScoutResult } from "@/lib/agents/scoutAgent";

type AnalystResult = {
  dimensions: {
    learning: number;
    distribution: number;
    problem: number;
    aiStructure: number;
  };
  summary: string;
};

function scoreFromSignals(signals: SignalRecord[], type: SignalRecord["signalType"]): number {
  return signals.filter((signal) => signal.signalType === type).length;
}

export async function analystAgent(
  startup: StartupRecord,
  signals: SignalRecord[],
  scout: ScoutResult,
): Promise<AnalystResult> {
  const last = startup.analyses[startup.analyses.length - 1];
  const base = last?.dimensions ?? {
    learning: 60,
    distribution: 60,
    problem: 60,
    aiStructure: 60,
  };

  const teamSignals = scoreFromSignals(signals, "team");
  const productSignals = scoreFromSignals(signals, "product");
  const distributionSignals = scoreFromSignals(signals, "distribution");
  const problemSignals = scoreFromSignals(signals, "problem");
  const aiSignals = scoreFromSignals(signals, "ai");

  const learning = Math.max(30, Math.min(95, base.learning + productSignals * 6 - teamSignals * 6));
  const distribution = Math.max(
    25,
    Math.min(95, base.distribution + distributionSignals * 7 - teamSignals * 4),
  );
  const problem = Math.max(35, Math.min(95, base.problem + problemSignals * 6));
  const aiStructure = Math.max(35, Math.min(95, base.aiStructure + aiSignals * 7 - teamSignals * 5));

  return {
    dimensions: { learning, distribution, problem, aiStructure },
    summary: `${startup.name}: ${scout.summary} Analyst sees movement in learning/distribution drivers.`,
  };
}
