import { useEffect, useState } from "react";
import { getEnvironmentalIndicators } from "../services/api";
import { calculateRiskScore, getRiskLevel } from "../services/riskScore";
import { generateEnvironmentalIntelligence } from "../services/intelligence";

function Environment() {
  const [environment, setEnvironment] = useState<any[]>([]);

  useEffect(() => {
    getEnvironmentalIndicators().then(setEnvironment);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Environment</h1>
        <p>Environmental monitoring and urban risk intelligence</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Environmental Indicators</h2>
          <p>
            Monitoring temperature, air quality, green coverage and water
            availability
          </p>
        </div>

        <div className="environment-grid">
          {environment.map((item) => {
            const riskScore = calculateRiskScore(item);
            const riskLevel = getRiskLevel(riskScore);
            const intelligence = generateEnvironmentalIntelligence(item);

            return (
              <div className="environment-card" key={item.id}>
                <h3>{item.area}</h3>

                <p>
                  <strong>Temperature:</strong> {item.temperature_c} °C
                </p>

                <p>
                  <strong>Air Quality Index:</strong> {item.air_quality_index}
                </p>

                <p>
                  <strong>Green Coverage:</strong> {item.green_coverage_percent}
                  %
                </p>

                <p>
                  <strong>Water:</strong> {item.water_availability}
                </p>

                <div className="risk-score">
                  <strong>Risk Score: {riskScore}/100</strong>
                </div>

                <span className={`risk-badge risk-${riskLevel.toLowerCase()}`}>
                  {riskLevel} Risk
                </span>
                <div className="intelligence-box">
                  <h4>GREENPULSE Intelligence</h4>

                  <p>
                    <strong>Intelligence Score:</strong> {intelligence.score}
                    /100
                  </p>

                  <p>
                    <strong>Predicted Risk:</strong> {intelligence.level}
                  </p>

                  <p>
                    <strong>Recommendation:</strong>{" "}
                    {intelligence.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Environment;
