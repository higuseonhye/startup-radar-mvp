import { ScoreDimensions } from "@/lib/types";

type SynthesizerInput = {
  startupName: string;
  dimensions: ScoreDimensions;
  riskLevel: "low" | "medium" | "high";
  caution: string;
};

type SynthesizerOutput = {
  insight: string;
  confidence: number;
  narrative: string;
};

export async function synthesizerAgent(input: SynthesizerInput): Promise<SynthesizerOutput> {
  const baseConfidence = input.riskLevel === "low" ? 0.76 : input.riskLevel === "medium" ? 0.64 : 0.52;
  const strongest = Object.entries(input.dimensions).sort((a, b) => b[1] - a[1])[0];

  return {
    insight: `${input.startupName} is strongest in ${strongest[0]} with a score of ${strongest[1]}.`,
    confidence: baseConfidence,
    narrative: `${input.caution} Focus on repeated behavior changes, not one-off hype.`,
  };
}
