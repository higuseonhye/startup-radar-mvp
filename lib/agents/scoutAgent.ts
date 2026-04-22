import { SignalRecord } from "@/lib/types";
import { groupSignalsByType } from "@/lib/pipeline/group";

export type ScoutResult = {
  summary: string;
  grouped: Record<string, number>;
};

export async function scoutAgent(signals: SignalRecord[]): Promise<ScoutResult> {
  const grouped = groupSignalsByType(signals);
  const summary = `Observed ${signals.length} recent signals across ${Object.keys(grouped).length} categories.`;

  return { summary, grouped };
}
