type SkepticInput = {
  analystSummary: string;
  unverifiedRatio: number;
};

type SkepticResult = {
  riskLevel: "low" | "medium" | "high";
  caution: string;
};

export async function skepticAgent(input: SkepticInput): Promise<SkepticResult> {
  if (input.unverifiedRatio > 0.5) {
    return {
      riskLevel: "high",
      caution: `Signal quality is weak (${Math.round(input.unverifiedRatio * 100)}% unverified).`,
    };
  }

  if (input.unverifiedRatio > 0.3) {
    return {
      riskLevel: "medium",
      caution: `Mixed evidence quality. ${input.analystSummary}`,
    };
  }

  return {
    riskLevel: "low",
    caution: "Most recent signals are verified; confidence can increase gradually.",
  };
}
