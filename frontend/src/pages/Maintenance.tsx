
import { useEffect, useState } from "react";
import {
  getMaintenanceTasks,
  getParks,
  getEnvironmentalIndicators,
  updateMaintenanceStatus,
} from "../services/api";

import {
  calculatePriorityScore,
  getPriorityLevel,
} from "../services/maintenancePriority";

import { calculateRiskScore } from "../services/riskScore";

function Maintenance() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [parks, setParks] = useState<any[]>([]);
  const [environment, setEnvironment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMaintenanceData();
  }, []);

  async function loadMaintenanceData() {
    try {
      setLoading(true);
      setError("");

      const [maintenanceData, parksData, environmentData] =
        await Promise.all([
          getMaintenanceTasks(),
          getParks(),
          getEnvironmentalIndicators(),
        ]);

      setTasks(maintenanceData);
      setParks(parksData);
      setEnvironment(environmentData);
    } catch (error) {
      console.error("Failed to load maintenance data:", error);
      setError("Unable to load maintenance data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    taskId: number,
    status: "Pending" | "In Progress" | "Completed",
  ) {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      await updateMaintenanceStatus(taskId, status);

      const updatedTasks = await getMaintenanceTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update maintenance status:", error);

      setError("Failed to update maintenance task status.");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Maintenance</h1>
          <p>
            AI-assisted maintenance prioritization for urban green
            infrastructure
          </p>
        </header>

        <main className="page-content">
          <div className="chart-card">
            <p>Loading maintenance tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Maintenance</h1>

        <p>
          AI-assisted maintenance prioritization for urban green
          infrastructure
        </p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Maintenance Priority</h2>

          <p>
            Maintenance tasks are prioritized using tree health, environmental
            risk, water availability and park condition.
          </p>
        </div>

        {error && (
          <div
            className="chart-card"
            style={{
              marginBottom: "20px",
              borderLeft: "4px solid #a33333",
            }}
          >
            <p style={{ color: "#a33333", margin: 0 }}>{error}</p>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="chart-card">
            <p>No maintenance tasks available.</p>
          </div>
        ) : (
          <div className="priority-grid">
            {tasks.map((task) => {
              const park = parks.find(
                (park) => park.name === task.park_name,
              );

              const environmentalData = environment.find(
                (item) =>
                  item.area?.toLowerCase() ===
                  park?.location?.toLowerCase(),
              );

              const environmentalRiskScore = environmentalData
                ? calculateRiskScore(environmentalData)
                : 20;

              const priorityScore = calculatePriorityScore({
                healthScore: Number(task.health_score),
                environmentalRiskScore,
                waterAvailability:
                  environmentalData?.water_availability || "Adequate",
                condition: park?.condition,
              });

              const priorityLevel = getPriorityLevel(priorityScore);

const priorityClass = `priority-${priorityLevel.toLowerCase()}`;
              return (
                <div className="priority-card" key={task.id}>
                  <div className="priority-header">
                    <div>
                      <h3>{task.task_type}</h3>

                      <p>
                        {task.tree_species} • {task.park_name}
                      </p>
                    </div>

                    <span className={`priority-badge ${priorityClass}`}>
                      {priorityLevel}
                    </span>
                  </div>

                  <p>
                    <strong>Park:</strong>{" "}
                    {park?.name || task.park_name}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {park?.location || "Unknown"}
                  </p>

                  <p>
                    <strong>Tree Species:</strong>{" "}
                    {task.tree_species}
                  </p>

                  <p>
                    <strong>Health Score:</strong>{" "}
                    {task.health_score}/100
                  </p>

                  <p>
                    <strong>Environmental Risk Score:</strong>{" "}
                    {environmentalRiskScore}/100
                  </p>

                  <p>
                    <strong>Water Availability:</strong>{" "}
                    {environmentalData?.water_availability || "Unknown"}
                  </p>

                  <p>
                    <strong>Park Condition:</strong>{" "}
                    {park?.condition || "Unknown"}
                  </p>

                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>

                  <p>
                    <strong>Due Date:</strong>{" "}
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "Not specified"}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {task.description}
                  </p>

                  <div className="priority-score">
                    <strong>
                      GREENPULSE Priority Score: {priorityScore}/100
                    </strong>
                  </div>

                  <div className="intelligence-box">
                    <h4>GREENPULSE Recommendation</h4>

                    <p>
                      {priorityLevel === "Critical"
                        ? "Immediate maintenance action is recommended. Inspect the tree and surrounding infrastructure as soon as possible."
                        : priorityLevel === "High"
                          ? "Schedule this task as a high-priority maintenance activity."
                          : priorityLevel === "Medium"
                            ? "Monitor this task and schedule maintenance soon."
                            : "Routine maintenance is sufficient."}
                    </p>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    {task.status === "Pending" && (
                      <button
                        type="button"
                        disabled={updatingTaskId === task.id}
                        onClick={() =>
                          handleStatusChange(task.id, "In Progress")
                        }
                        style={{
                          padding: "9px 14px",
                          border: "none",
                          borderRadius: "8px",
                          background: "var(--green-main)",
                          color: "white",
                          cursor:
                            updatingTaskId === task.id
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            updatingTaskId === task.id ? 0.7 : 1,
                        }}
                      >
                        {updatingTaskId === task.id
                          ? "Updating..."
                          : "Start Task"}
                      </button>
                    )}

                    {task.status === "In Progress" && (
                      <button
                        type="button"
                        disabled={updatingTaskId === task.id}
                        onClick={() =>
                          handleStatusChange(task.id, "Completed")
                        }
                        style={{
                          padding: "9px 14px",
                          border: "none",
                          borderRadius: "8px",
                          background: "var(--green-main)",
                          color: "white",
                          cursor:
                            updatingTaskId === task.id
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            updatingTaskId === task.id ? 0.7 : 1,
                        }}
                      >
                        {updatingTaskId === task.id
                          ? "Updating..."
                          : "Complete Task"}
                      </button>
                    )}

                    {task.status === "Completed" && (
                      <span
                        style={{
                          color: "var(--green-main)",
                          fontWeight: 700,
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Maintenance;

