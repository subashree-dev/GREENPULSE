import {
  calculateRiskScore,
  getRiskLevel,
} from "./riskScore";

import type { EnvironmentalData } from "./riskScore";

export interface IntelligenceResult {
  score: number;
  level: "Low" | "Moderate" | "High";
  recommendation: string;
  reasons: string[];
}

export function generateEnvironmentalIntelligence(
  item: EnvironmentalData,
): IntelligenceResult {
  const score = calculateRiskScore(item);
  const level = getRiskLevel(score);

  const temperature = Number(item.temperature_c);
  const aqi = Number(item.air_quality_index);
  const greenCoverage = Number(item.green_coverage_percent);

  const reasons: string[] = [];

  if (aqi >= 80) {
    reasons.push("elevated air quality index");
  }

  if (temperature >= 34) {
    reasons.push("high temperature");
  }

  if (greenCoverage < 30) {
    reasons.push("low green coverage");
  }

  if (item.water_availability?.toLowerCase() === "low") {
    reasons.push("low water availability");
  }

  let recommendation = "Continue regular environmental monitoring.";

  if (level === "High") {
    recommendation =
      "Immediate inspection recommended. Improve green coverage, monitor air quality, and review water availability.";
  } else if (level === "Moderate") {
    recommendation =
      "Increase monitoring frequency and consider improving vegetation and irrigation.";
  }

  return {
    score,
    level,
    recommendation,
    reasons,
  };
}