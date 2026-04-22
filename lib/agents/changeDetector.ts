import { ChangeRecord } from "@/lib/types";

export function detectChange(
  startupId: string,
  prevScore: number,
  nextScore: number,
  reason: string,
  evidence: string,
): ChangeRecord | null {
  const diff = nextScore - prevScore;
  if (Math.abs(diff) < 3) {
    return null;
  }

  return {
    id: `${startupId}-change-${Date.now()}`,
    prevScore,
    newScore: nextScore,
    reason,
    evidence,
    createdAt: new Date().toISOString(),
  };
}
