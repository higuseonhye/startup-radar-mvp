import { SignalRecord } from "@/lib/types";

const CANDIDATE_SIGNALS = [
  {
    source: "X",
    content: "Founders shared weekly update with faster iteration cycle.",
    signalType: "product",
    isVerified: false,
  },
  {
    source: "Product Hunt",
    content: "Community comments highlighted improved onboarding experience.",
    signalType: "distribution",
    isVerified: true,
  },
  {
    source: "RSS",
    content: "Customer interview indicates this workflow is becoming mission critical.",
    signalType: "problem",
    isVerified: true,
  },
  {
    source: "GitHub",
    content: "New agent orchestration module merged with extensive tests.",
    signalType: "ai",
    isVerified: true,
  },
  {
    source: "X",
    content: "Team member departure discussed in founder thread.",
    signalType: "team",
    isVerified: false,
  },
] as const;

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function ingestSignals(startupId: string): SignalRecord[] {
  const count = 1 + randomInt(2);

  return Array.from({ length: count }).map((_, idx) => {
    const sample = CANDIDATE_SIGNALS[randomInt(CANDIDATE_SIGNALS.length)];

    return {
      id: `${startupId}-${Date.now()}-${idx}`,
      source: sample.source,
      content: sample.content,
      signalType: sample.signalType,
      isVerified: sample.isVerified,
      createdAt: new Date().toISOString(),
    };
  });
}
