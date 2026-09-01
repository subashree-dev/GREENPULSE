import { useEffect, useState } from "react";
import { generateCityIntelligence } from "../services/cityIntelligence";
import {
  getParks,
  getTrees,
  getMaintenanceTasks,
  getCitizenReports,
  getEnvironmentalIndicators,
} from "../services/api";
import { calculateRiskScore, getRiskLevel } from "../services/riskScore";
import {
  calculatePriorityScore,
  getPriorityLevel,
} from "../services/maintenancePriority";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../App.css";

function Dashboard() {
  const [parks, setParks] = useState<any[]>([]);
  const [trees, setTrees] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [environment, setEnvironment] = useState<any[]>([]);

  useEffect(() => {
    getParks().then(setParks);
    getTrees().then(setTrees);
    getMaintenanceTasks().then(setMaintenance);
    getCitizenReports().then(setReports);
    getEnvironmentalIndicators().then(setEnvironment);
  }, []);

  // TREE HEALTH
  const healthyTrees = trees.filter(
    (tree) => Number(tree.health_score) >= 70,
  ).length;

  const attentionTrees = trees.filter(
    (tree) => Number(tree.health_score) >= 50 && Number(tree.health_score) < 70,
  ).length;

  const highRiskTrees = trees.filter(
    (tree) => Number(tree.health_score) < 50,
  ).length;

  const averageTreeHealth =
    trees.length > 0
      ? Math.round(
          trees.reduce((total, tree) => total + Number(tree.health_score), 0) /
            trees.length,
        )
      : 0;

  // CITY ENVIRONMENTAL RISK
  const environmentalRiskScores = environment.map((item) =>
    calculateRiskScore(item),
  );
  const averageEnvironmentalRisk =
    environmentalRiskScores.length > 0
      ? Math.round(
          environmentalRiskScores.reduce((total, score) => total + score, 0) /
            environmentalRiskScores.length,
        )
      : 0;
  // CHART DATA

  const treeHealthData = [
    {
      name: "Healthy",
      value: healthyTrees,
    },
    {
      name: "Attention",
      value: attentionTrees,
    },
    {
      name: "High Risk",
      value: highRiskTrees,
    },
  ];

  const environmentalRiskData = environment.map((item) => ({
    area: item.area,
    risk: calculateRiskScore(item),
  }));

  const greenCoverageData = environment.map((item) => ({
    area: item.area,
    coverage: Number(item.green_coverage_percent),
  }));
  const cityIntelligence = generateCityIntelligence(environment);

  // MAINTENANCE PRIORITY
  const priorityItems = trees
    .map((tree) => {
      const priorityScore = calculatePriorityScore({
        healthScore: Number(tree.health_score),
        environmentalRiskScore: averageEnvironmentalRisk,
        waterAvailability: "Moderate",
        condition: "Fair",
      });

      return {
        ...tree,
        priorityScore,
        priorityLevel: getPriorityLevel(priorityScore),
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>GREENPULSE</h1>

        <p>Smart Urban Green Infrastructure Intelligence Platform</p>
      </header>

      <main className="dashboard-content">
        {/* OVERVIEW */}
        <div className="section-title">
          <h2>City Green Infrastructure Overview</h2>

          <p>Live information from the GREENPULSE platform</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Parks</h3>
            <strong>{parks.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Total Trees</h3>
            <strong>{trees.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Maintenance Tasks</h3>
            <strong>{maintenance.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Citizen Reports</h3>
            <strong>{reports.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Environmental Records</h3>
            <strong>{environment.length}</strong>
          </div>
        </div>

        {/* PARKS */}
        <div className="section-title">
          <h2>City Parks</h2>

          <p>Current condition and irrigation status</p>
        </div>

        <div className="parks-grid">
          {parks.map((park) => (
            <div className="park-card" key={park.id}>
              <h3>{park.name}</h3>

              <p>
                <strong>Location:</strong> {park.location}, {park.city}
              </p>

              <p>
                <strong>Area:</strong> {park.area_sq_m} m²
              </p>

              <p>
                <strong>Irrigation:</strong> {park.irrigation_status}
              </p>

              <span className="condition">{park.condition}</span>
            </div>
          ))}
        </div>

        {/* ENVIRONMENT */}
        <div className="section-title environment-title">
          <h2>Environmental Intelligence</h2>

          <p>Environmental conditions and calculated risk levels</p>
        </div>

        <div className="environment-grid">
          {environment.map((item) => {
            const riskScore = calculateRiskScore(item);

            const riskLevel = getRiskLevel(riskScore);

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
                  <strong>Water Availability:</strong> {item.water_availability}
                </p>

                <div className="risk-score">
                  <strong>Risk Score: {riskScore}/100</strong>
                </div>

                <span className={`risk-badge risk-${riskLevel.toLowerCase()}`}>
                  {riskLevel} Risk
                </span>
              </div>
            );
          })}
        </div>

        {/* TREE HEALTH */}
        <div className="section-title environment-title">
          <h2>Tree Health Intelligence</h2>

          <p>Health assessment of monitored trees</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Average Tree Health</h3>
            <strong>{averageTreeHealth}%</strong>
          </div>

          <div className="stat-card">
            <h3>Healthy Trees</h3>
            <strong>{healthyTrees}</strong>
          </div>

          <div className="stat-card">
            <h3>Needs Attention</h3>
            <strong>{attentionTrees}</strong>
          </div>

          <div className="stat-card">
            <h3>High Risk Trees</h3>
            <strong>{highRiskTrees}</strong>
          </div>
        </div>

        <div className="tree-grid">
          {trees.map((tree) => {
            const healthScore = Number(tree.health_score);

            let healthClass = "tree-low";

            if (healthScore >= 70) {
              healthClass = "tree-good";
            } else if (healthScore >= 50) {
              healthClass = "tree-medium";
            }

            return (
              <div className="tree-card" key={tree.id}>
                <h3>{tree.species}</h3>

                <p>
                  Health Score: <strong>{healthScore}%</strong>
                </p>

                <div className="health-bar">
                  <div
                    className={`health-fill ${healthClass}`}
                    style={{
                      width: `${healthScore}%`,
                    }}
                  />
                </div>

                <span className={`tree-badge ${healthClass}`}>
                  {tree.risk_level}
                </span>
              </div>
            );
          })}
        </div>
        {/* ANALYTICS */}
        {/* CITY INTELLIGENCE */}

        <div className="section-title">
          <h2>GREENPULSE City Intelligence</h2>

          <p>Overall environmental intelligence and priority recommendations</p>
        </div>

        <div className="city-intelligence-grid">
          <div className="intelligence-stat-card">
            <span>Overall Environmental Risk</span>

            <strong>{cityIntelligence.averageRisk}/100</strong>
          </div>

          <div className="intelligence-stat-card">
            <span>High Risk Areas</span>

            <strong>{cityIntelligence.highRiskAreas}</strong>
          </div>

          <div className="intelligence-stat-card">
            <span>Average Green Coverage</span>

            <strong>{cityIntelligence.averageGreenCoverage}%</strong>
          </div>

          <div className="intelligence-stat-card">
            <span>Highest Risk Area</span>

            <strong>{cityIntelligence.highestRiskArea}</strong>

            <small>Risk Score: {cityIntelligence.highestRiskScore}/100</small>
          </div>
        </div>

        <div className="city-recommendation">
          <h3>Recommended Action</h3>

          <p>{cityIntelligence.recommendation}</p>
        </div>

        <div className="section-title environment-title">
          <h2>GREENPULSE Analytics</h2>

          <p>Data-driven insights from urban green infrastructure</p>
        </div>

        <div className="analytics-grid">
          {/* TREE HEALTH CHART */}

          <div className="chart-card">
            <h3>Tree Health Distribution</h3>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={treeHealthData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {treeHealthData.map((_, index) => (
                      <Cell key={index} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ENVIRONMENTAL RISK */}

          <div className="chart-card">
            <h3>Environmental Risk by Area</h3>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={environmentalRiskData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="area" />

                  <YAxis domain={[0, 100]} />

                  <Tooltip />

                  <Bar dataKey="risk" name="Risk Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GREEN COVERAGE */}

          <div className="chart-card">
            <h3>Green Coverage by Area</h3>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={greenCoverageData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="area" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="coverage" name="Green Coverage %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* MAINTENANCE PRIORITY */}
        <div className="section-title environment-title">
          <h2>Maintenance Priority Intelligence</h2>

          <p>
            Automatically ranked using tree health and city environmental risk
          </p>
        </div>

        <div className="priority-grid">
          {priorityItems.slice(0, 8).map((item, index) => (
            <div className="priority-card" key={item.id}>
              <div className="priority-header">
                <h3>
                  #{index + 1} {item.species}
                </h3>

                <span
                  className={`priority-badge priority-${item.priorityLevel.toLowerCase()}`}
                >
                  {item.priorityLevel}
                </span>
              </div>

              <p>
                <strong>Health:</strong> {item.health_score}%
              </p>

              <p>
                <strong>City Environmental Risk:</strong>{" "}
                {averageEnvironmentalRisk}/100
              </p>

              <div className="priority-score">
                Priority Score: <strong>{item.priorityScore}/100</strong>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
