import { SignalRecord } from "@/lib/types";

export function normalizeSignals(signals: SignalRecord[]): SignalRecord[] {
  return signals.map((signal) => ({
    ...signal,
    content: signal.content.trim(),
  }));
}
