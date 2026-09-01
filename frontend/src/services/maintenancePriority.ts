export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

interface PriorityData {
  healthScore: number;
  environmentalRiskScore: number;
  waterAvailability: string;
  condition?: string;
}

export function calculatePriorityScore(data: PriorityData): number {
  let score = 0;

  const healthScore = Number(data.healthScore);
  const environmentalRisk = Number(data.environmentalRiskScore);

  // Poor tree health increases priority
  if (healthScore < 40) {
    score += 40;
  } else if (healthScore < 60) {
    score += 30;
  } else if (healthScore < 75) {
    score += 15;
  }

  // Environmental risk increases priority
  if (environmentalRisk >= 70) {
    score += 35;
  } else if (environmentalRisk >= 45) {
    score += 20;
  } else {
    score += 5;
  }

  // Water shortage increases priority
  if (data.waterAvailability === "Low") {
    score += 15;
  }

  // Poor park condition increases priority
  if (data.condition === "Poor") {
    score += 10;
  } else if (data.condition === "Fair") {
    score += 5;
  }

  return Math.min(score, 100);
}

export function getPriorityLevel(score: number): PriorityLevel {
  if (score >= 75) {
    return "Critical";
  }

  if (score >= 50) {
    return "High";
  }

  if (score >= 25) {
    return "Medium";
  }

  return "Low";
}
