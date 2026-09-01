import { useEffect, useState } from "react";
import { getTrees } from "../services/api";

function Trees() {
  const [trees, setTrees] = useState<any[]>([]);

  useEffect(() => {
    getTrees().then(setTrees);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Trees</h1>
        <p>Tree health monitoring and risk assessment</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Tree Health Monitoring</h2>
          <p>{trees.length} trees currently monitored</p>
        </div>

        <div className="tree-grid">
          {trees.map((tree) => {
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
      </main>
    </div>
  );
}

export default Trees;
