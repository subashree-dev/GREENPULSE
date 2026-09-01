export type RiskLevel = "Low" | "Moderate" | "High";

export interface EnvironmentalData {
  temperature_c: string | number;
  air_quality_index: string | number;
  green_coverage_percent: string | number;
  water_availability: string;
}

/**
 * Single canonical environmental risk calculation
 * used throughout GREENPULSE.
 */
export function calculateRiskScore(data: EnvironmentalData): number {
  const temperature = Number(data.temperature_c);
  const aqi = Number(data.air_quality_index);
  const greenCoverage = Number(data.green_coverage_percent);

  let score = 0;

  // Air quality
  if (aqi >= 100) {
    score += 40;
  } else if (aqi >= 80) {
    score += 30;
  } else if (aqi >= 60) {
    score += 20;
  } else {
    score += 10;
  }

  // Temperature
  if (temperature >= 36) {
    score += 30;
  } else if (temperature >= 34) {
    score += 20;
  } else if (temperature >= 32) {
    score += 10;
  }

  // Green coverage
  if (greenCoverage < 20) {
    score += 30;
  } else if (greenCoverage < 30) {
    score += 20;
  } else {
    score += 10;
  }

  // Water availability
  if (data.water_availability?.toLowerCase() === "low") {
    score += 10;
  }

  return Math.min(score, 100);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) {
    return "High";
  }

  if (score >= 45) {
    return "Moderate";
  }

  return "Low";
}