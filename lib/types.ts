export type ScoreDimensions = {
  learning: number;
  distribution: number;
  problem: number;
  aiStructure: number;
};

export type AnalysisRecord = {
  aliveScore: number;
  dimensions: ScoreDimensions;
  insight: string;
  debateLog: {
    scout: string;
    analyst: string;
    skeptic: string;
    synthesizer: string;
  };
  confidence: number;
  createdAt: string;
};

export type SignalRecord = {
  id: string;
  source: string;
  content: string;
  signalType: "team" | "product" | "distribution" | "problem" | "ai" | "general";
  isVerified: boolean;
  createdAt: string;
};

export type ChangeRecord = {
  id: string;
  prevScore: number;
  newScore: number;
  reason: string;
  evidence: string;
  createdAt: string;
};

export type StartupRecord = {
  id: string;
  name: string;
  description: string;
  sector: string;
  stage: string;
  signals: SignalRecord[];
  analyses: AnalysisRecord[];
  changes: ChangeRecord[];
};

export type PortfolioItem = {
  startupId: string;
  weight: number;
  note?: string;
  createdAt: string;
};

export type AlertRecord = {
  id: string;
  startupId: string;
  startupName: string;
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
  read: boolean;
};

export type RadarState = {
  startups: StartupRecord[];
  portfolio: PortfolioItem[];
  alerts: AlertRecord[];
  updatedAt: string;
};
