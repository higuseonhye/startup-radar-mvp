import { analystAgent } from "@/lib/agents/analystAgent";
import { scoutAgent } from "@/lib/agents/scoutAgent";
import { skepticAgent } from "@/lib/agents/skepticAgent";
import { synthesizerAgent } from "@/lib/agents/synthesizerAgent";
import { calculateAliveScore } from "@/lib/scoring/aliveScore";
import { SignalRecord, StartupRecord } from "@/lib/types";

export async function runDebate(startup: StartupRecord, recentSignals: SignalRecord[]) {
  const scout = await scoutAgent(recentSignals);
  const analyst = await analystAgent(startup, recentSignals, scout);
  const unverifiedCount = recentSignals.filter((signal) => !signal.isVerified).length;
  const skeptic = await skepticAgent({
    analystSummary: analyst.summary,
    unverifiedRatio: unverifiedCount / Math.max(recentSignals.length, 1),
  });
  const synthesizer = await synthesizerAgent({
    startupName: startup.name,
    dimensions: analyst.dimensions,
    riskLevel: skeptic.riskLevel,
    caution: skeptic.caution,
  });

  return {
    aliveScore: calculateAliveScore(analyst.dimensions),
    dimensions: analyst.dimensions,
    insight: `${synthesizer.insight} ${synthesizer.narrative}`,
    confidence: synthesizer.confidence,
    debateLog: {
      scout: scout.summary,
      analyst: analyst.summary,
      skeptic: skeptic.caution,
      synthesizer: synthesizer.insight,
    },
  };
}
