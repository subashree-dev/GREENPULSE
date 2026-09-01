import { generateEnvironmentalIntelligence } from "./intelligence";

export interface CityIntelligence {
  averageRisk: number;
  highRiskAreas: number;
  averageGreenCoverage: number;
  highestRiskArea: string;
  highestRiskScore: number;
  recommendation: string;
}

export function generateCityIntelligence(environment: any[]): CityIntelligence {
  if (!environment || environment.length === 0) {
    return {
      averageRisk: 0,
      highRiskAreas: 0,
      averageGreenCoverage: 0,
      highestRiskArea: "No data",
      highestRiskScore: 0,
      recommendation: "Environmental data is not available.",
    };
  }

  const intelligenceResults = environment.map((item) => ({
    area: item.area,
    ...generateEnvironmentalIntelligence(item),
    greenCoverage: Number(item.green_coverage_percent),
  }));

  const averageRisk = Math.round(
    intelligenceResults.reduce((sum, item) => sum + item.score, 0) /
      intelligenceResults.length,
  );

  const highRiskAreas = intelligenceResults.filter(
    (item) => item.level === "High",
  ).length;

  const averageGreenCoverage = Number(
    (
      intelligenceResults.reduce((sum, item) => sum + item.greenCoverage, 0) /
      intelligenceResults.length
    ).toFixed(1),
  );

  const highestRisk = [...intelligenceResults].sort(
    (a, b) => b.score - a.score,
  )[0];

  let recommendation = "Continue regular environmental monitoring.";

  if (highestRisk.level === "High") {
    recommendation = `Immediate attention required in ${highestRisk.area}. Improve green coverage, monitor air quality, and inspect water availability.`;
  } else if (highestRisk.level === "Moderate") {
    recommendation = `Increase environmental monitoring in ${highestRisk.area} and consider improving vegetation and irrigation.`;
  }

  return {
    averageRisk,
    highRiskAreas,
    averageGreenCoverage,
    highestRiskArea: highestRisk.area,
    highestRiskScore: highestRisk.score,
    recommendation,
  };
}
