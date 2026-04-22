import { writeState } from "../lib/memory/store";
import { RadarState } from "../lib/types";

const starterDate = "2026-04-19T12:00:00.000Z";

const startupSeeds = [
  {
    id: "synq",
    name: "Synq",
    description: "AI-native dev workflow assistant for software teams.",
    sector: "Developer Tools",
    stage: "Seed",
    scores: { learning: 79, distribution: 72, problem: 71, aiStructure: 75, alive: 74 },
    signal: {
      source: "Product Hunt",
      content: "Launched private beta with rapid invite growth.",
      signalType: "distribution",
      isVerified: true,
    },
    insight: "Synq is compounding through consistent shipping and growing developer referrals.",
  },
  {
    id: "beamline",
    name: "Beamline",
    description: "Autonomous supply chain monitor for e-commerce operators.",
    sector: "Commerce Ops",
    stage: "Pre-seed",
    scores: { learning: 66, distribution: 61, problem: 77, aiStructure: 64, alive: 67 },
    signal: {
      source: "RSS",
      content: "Pilot expanded from 3 to 7 warehouses.",
      signalType: "problem",
      isVerified: true,
    },
    insight: "Beamline solves a painful workflow but needs stronger repeatable distribution.",
  },
  {
    id: "orbitiq",
    name: "OrbitIQ",
    description: "AI co-pilot for technical sales teams with proposal automation.",
    sector: "B2B SaaS",
    stage: "Seed",
    scores: { learning: 70, distribution: 66, problem: 74, aiStructure: 73, alive: 71 },
    signal: {
      source: "GitHub",
      content: "New agent workflow templates released.",
      signalType: "ai",
      isVerified: true,
    },
    insight: "OrbitIQ has strong AI dependency and credible value proof.",
  },
  {
    id: "pulsegrid",
    name: "PulseGrid",
    description: "Real-time retail demand sensing for independent brands.",
    sector: "Retail AI",
    stage: "Pre-seed",
    scores: { learning: 63, distribution: 68, problem: 69, aiStructure: 61, alive: 65 },
    signal: {
      source: "X",
      content: "Founders reported repeat weekly usage from 40 stores.",
      signalType: "distribution",
      isVerified: false,
    },
    insight: "PulseGrid spreads fast in communities but needs deeper moat evidence.",
  },
  {
    id: "nota",
    name: "Nota",
    description: "Autonomous compliance monitor for fintech operations.",
    sector: "Fintech Infrastructure",
    stage: "Seed",
    scores: { learning: 74, distribution: 60, problem: 82, aiStructure: 72, alive: 72 },
    signal: {
      source: "RSS",
      content: "Pilot customer renewed after reducing manual audit workload by 35%.",
      signalType: "problem",
      isVerified: true,
    },
    insight: "Nota has strong problem urgency with early evidence of tangible ROI.",
  },
  {
    id: "hiverun",
    name: "HiveRun",
    description: "Agent-based customer support orchestration for SaaS companies.",
    sector: "Support Automation",
    stage: "Seed",
    scores: { learning: 77, distribution: 70, problem: 68, aiStructure: 78, alive: 74 },
    signal: {
      source: "GitHub",
      content: "Released parallel agent execution mode with retrieval memory.",
      signalType: "ai",
      isVerified: true,
    },
    insight: "HiveRun shows strong AI dependency and consistent technical execution.",
  },
  {
    id: "trailiq",
    name: "TrailIQ",
    description: "Autonomous outbound intelligence layer for GTM teams.",
    sector: "SalesTech",
    stage: "Pre-seed",
    scores: { learning: 71, distribution: 64, problem: 66, aiStructure: 70, alive: 68 },
    signal: {
      source: "Product Hunt",
      content: "Users highlighted higher reply rates after one week of use.",
      signalType: "problem",
      isVerified: false,
    },
    insight: "TrailIQ has promising directional fit, but signal confidence is mixed.",
  },
  {
    id: "quarry",
    name: "Quarry",
    description: "Construction planning co-pilot with autonomous schedule risk detection.",
    sector: "PropTech",
    stage: "Seed",
    scores: { learning: 69, distribution: 57, problem: 80, aiStructure: 67, alive: 67 },
    signal: {
      source: "RSS",
      content: "General contractor expanded usage across 5 active projects.",
      signalType: "distribution",
      isVerified: true,
    },
    insight: "Quarry is solving a painful problem but distribution remains concentrated.",
  },
  {
    id: "atlasbio",
    name: "AtlasBio",
    description: "AI-first biotech literature synthesis and experiment planning.",
    sector: "BioTech AI",
    stage: "Pre-seed",
    scores: { learning: 75, distribution: 52, problem: 73, aiStructure: 81, alive: 70 },
    signal: {
      source: "GitHub",
      content: "Team open-sourced retrieval benchmark scripts for wet-lab planning.",
      signalType: "ai",
      isVerified: true,
    },
    insight: "AtlasBio has high technical leverage with still-limited market spread.",
  },
  {
    id: "sparknode",
    name: "SparkNode",
    description: "AI-native cloud cost optimizer with autonomous remediation.",
    sector: "Cloud Infra",
    stage: "Seed",
    scores: { learning: 78, distribution: 71, problem: 79, aiStructure: 77, alive: 76 },
    signal: {
      source: "RSS",
      content: "Three startups reported 18% monthly infra savings after rollout.",
      signalType: "problem",
      isVerified: true,
    },
    insight: "SparkNode combines urgent pain relief with fast learning loops.",
  },
] as const;

const seedState: RadarState = {
  updatedAt: new Date().toISOString(),
  portfolio: [
    {
      startupId: "synq",
      weight: 35,
      note: "Team shipping velocity is strong.",
      createdAt: "2026-04-20T11:00:00.000Z",
    },
    {
      startupId: "sparknode",
      weight: 22,
      note: "Strong unit-economics signal from early adopters.",
      createdAt: "2026-04-20T12:00:00.000Z",
    },
    {
      startupId: "hiverun",
      weight: 18,
      note: "High AI-structure score; watch distribution expansion.",
      createdAt: "2026-04-20T12:30:00.000Z",
    },
  ],
  alerts: [],
  startups: startupSeeds.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    sector: entry.sector,
    stage: entry.stage,
    signals: [
      {
        id: `${entry.id}-s1`,
        source: entry.signal.source,
        content: entry.signal.content,
        signalType: entry.signal.signalType,
        isVerified: entry.signal.isVerified,
        createdAt: starterDate,
      },
    ],
    analyses: [
      {
        aliveScore: entry.scores.alive,
        dimensions: {
          learning: entry.scores.learning,
          distribution: entry.scores.distribution,
          problem: entry.scores.problem,
          aiStructure: entry.scores.aiStructure,
        },
        insight: entry.insight,
        debateLog: {
          scout: "Observed startup-level baseline market and product signals.",
          analyst: "Scored across learning, distribution, problem, and AI structure.",
          skeptic: "Confidence is moderate until repeat cycles confirm trend direction.",
          synthesizer: "Use this as baseline state for change tracking.",
        },
        confidence: 0.65,
        createdAt: starterDate,
      },
    ],
    changes: [],
  })),
};

async function run() {
  await writeState(seedState);
  console.log("Seed data has been written to data/state.json");
}

run().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
