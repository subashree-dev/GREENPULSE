import { useEffect, useState } from "react";
import { getTrees } from "../services/api";

function Trees() {
  const [trees, setTrees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    getTrees().then(setTrees);
  }, []);

  const riskLevels = [
    "All",
    ...Array.from(
      new Set(trees.map((tree) => tree.risk_level).filter(Boolean)),
    ),
  ];

  const filteredTrees = trees.filter((tree) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      tree.species?.toLowerCase().includes(search) ||
      tree.risk_level?.toLowerCase().includes(search);

    const matchesRisk = riskFilter === "All" || tree.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Trees</h1>
        <p>Tree health monitoring and risk assessment</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Tree Health Monitoring</h2>
          <p>
            {filteredTrees.length} of {trees.length} trees displayed
          </p>
        </div>

        <div className="tree-filters">
          <input
            type="text"
            placeholder="Search tree species or risk level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            {riskLevels.map((risk) => (
              <option key={risk} value={risk}>
                {risk === "All" ? "All Risk Levels" : risk}
              </option>
            ))}
          </select>
        </div>

        <div className="tree-grid">
          {filteredTrees.map((tree) => {
            const score = Number(tree.health_score);

            let healthClass = "tree-low";

            if (score >= 70) {
              healthClass = "tree-good";
            } else if (score >= 50) {
              healthClass = "tree-medium";
            }

            return (
              <div className="tree-card" key={tree.id}>
                <h3>{tree.species}</h3>

                <p>
                  Health Score: <strong>{score}%</strong>
                </p>

                <div className="health-bar">
                  <div
                    className={`health-fill ${healthClass}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <span className={`tree-badge ${healthClass}`}>
                  {tree.risk_level}
                </span>
              </div>
            );
          })}
        </div>

        {filteredTrees.length === 0 && (
          <div className="empty-state">
            <p>No trees match your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Trees;
