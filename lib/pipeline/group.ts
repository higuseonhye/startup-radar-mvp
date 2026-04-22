import { SignalRecord } from "@/lib/types";

export function groupSignalsByType(signals: SignalRecord[]): Record<string, number> {
  return signals.reduce<Record<string, number>>((acc, signal) => {
    acc[signal.signalType] = (acc[signal.signalType] ?? 0) + 1;
    return acc;
  }, {});
}
