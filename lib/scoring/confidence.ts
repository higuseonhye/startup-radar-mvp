import { SignalRecord, StartupRecord } from "@/lib/types";

type ConfidenceModel = {
  confidence: number;
  breakdown: {
    signalCount: number;
    sourceDiversity: number;
    verifiedRatio: number;
    consistency: number;
    signalStrength: "low" | "medium" | "high";
  };
  caveats: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getConsistencyScore(signals: SignalRecord[]): number {
  if (signals.length === 0) return 0;
  const positiveSignals = signals.filter((signal) => signal.signalType !== "team").length;
  const negativeSignals = signals.length - positiveSignals;
  const consistency = Math.abs(positiveSignals - negativeSignals) / signals.length;
  return clamp(consistency, 0, 1);
}

function getSignalStrength(uniqueSources: number): "low" | "medium" | "high" {
  if (uniqueSources >= 3) return "high";
  if (uniqueSources >= 2) return "medium";
  return "low";
}

export function calculateConfidence(startup: StartupRecord, recentSignals: SignalRecord[]): ConfidenceModel {
  const signalCount = recentSignals.length;
  const uniqueSources = new Set(recentSignals.map((signal) => signal.source)).size;
  const verifiedCount = recentSignals.filter((signal) => signal.isVerified).length;
  const verifiedRatio = signalCount === 0 ? 0 : verifiedCount / signalCount;
  const consistency = getConsistencyScore(recentSignals);
  const signalStrength = getSignalStrength(uniqueSources);

  // Base confidence model: quantity + source diversity + verification + directional consistency.
  const signalCountScore = clamp(signalCount / 4, 0, 1) * 0.35;
  const sourceDiversityScore = clamp(uniqueSources / 3, 0, 1) * 0.3;
  const verificationScore = verifiedRatio * 0.25;
  const consistencyScore = consistency * 0.1;

  // Small maturity bonus when we have historical evaluations.
  const maturityBonus = startup.analyses.length >= 3 ? 0.03 : 0;

  const confidence = clamp(
    signalCountScore + sourceDiversityScore + verificationScore + consistencyScore + maturityBonus,
    0.25,
    0.95,
  );

  const caveats: string[] = [];
  if (signalCount < 2) caveats.push("Early signal - limited data points.");
  if (uniqueSources < 2) caveats.push("Source diversity is low.");
  if (verifiedRatio < 0.5) caveats.push("A large portion of the latest signals are unverified.");
  if (consistency < 0.35) caveats.push("Signals are mixed and may be noisy.");

  if (caveats.length === 0) {
    caveats.push("Current evidence is relatively stable, but future updates may change the view.");
  }

  return {
    confidence,
    breakdown: {
      signalCount,
      sourceDiversity: uniqueSources,
      verifiedRatio: Number(verifiedRatio.toFixed(2)),
      consistency: Number(consistency.toFixed(2)),
      signalStrength,
    },
    caveats,
  };
}
