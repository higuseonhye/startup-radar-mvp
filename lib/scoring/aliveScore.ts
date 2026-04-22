import { ScoreDimensions } from "@/lib/types";

const WEIGHTS = {
  learning: 0.3,
  distribution: 0.25,
  problem: 0.2,
  aiStructure: 0.25,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateAliveScore(scores: ScoreDimensions): number {
  const total =
    scores.learning * WEIGHTS.learning +
    scores.distribution * WEIGHTS.distribution +
    scores.problem * WEIGHTS.problem +
    scores.aiStructure * WEIGHTS.aiStructure;

  return Math.round(clamp(total, 0, 100));
}
