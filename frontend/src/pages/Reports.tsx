import { useEffect, useState } from "react";
import type { FormEvent } from "react";import {
  createCitizenReport,
  getCitizenReports,
  getParks,
} from "../services/api";

interface CitizenReport {
  id: number;
  report_type: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  created_at: string;
  park_name: string;
  reported_by: string;
}

interface Park {
  id: number;
  name: string;
  location: string;
}

function Reports() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [parks, setParks] = useState<Park[]>([]);

  const [reportType, setReportType] = useState("Broken Branch");
  const [parkId, setParkId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [reportsData, parksData] = await Promise.all([
        getCitizenReports(),
        getParks(),
      ]);

      setReports(reportsData);
      setParks(parksData);

      if (parksData.length > 0 && !parkId) {
        setParkId(String(parksData[0].id));
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!parkId || !description.trim()) {
      setError("Please select a park and enter a description.");
      return;
    }

    try {
      setSubmitting(true);

      const selectedPark = parks.find((park) => park.id === Number(parkId));

      await createCitizenReport({
        user_id: 3,
        park_id: Number(parkId),
        report_type: reportType,
        description: description.trim(),
        location: selectedPark?.location || "",
        priority,
      });

      setDescription("");
      setSuccess("Citizen report submitted successfully.");

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to submit citizen report.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Citizen Reports</h1>
        <p>Community-reported issues across GREENPULSE parks</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Submit a Report</h2>
          <p>
            Report damaged trees, irrigation problems, or other park issues.
          </p>
        </div>

        <div className="chart-card">
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <label>Report Type</label>
                <select
                  value={reportType}
                  onChange={(event) => setReportType(event.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "6px" }}
                >
                  <option>Broken Branch</option>
                  <option>Dry Tree</option>
                  <option>Irrigation Issue</option>
                  <option>Pest Issue</option>
                  <option>Park Damage</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label>Park</label>
                <select
                  value={parkId}
                  onChange={(event) => setParkId(event.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "6px" }}
                >
                  <option value="">Select a park</option>
                  {parks.map((park) => (
                    <option key={park.id} value={park.id}>
                      {park.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "6px" }}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the issue..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "6px",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: "#a33333", marginTop: "16px" }}>{error}</p>
            )}

            {success && (
              <p style={{ color: "#246b45", marginTop: "16px" }}>{success}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "18px",
                padding: "11px 18px",
                border: "none",
                borderRadius: "8px",
                background: "var(--green-main)",
                color: "white",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>

        <div className="section-title" style={{ marginTop: "35px" }}>
          <h2>Reported Issues</h2>
          <p>{reports.length} reports currently registered</p>
        </div>

        {loading && (
          <div className="chart-card">
            <p>Loading citizen reports...</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="chart-card">
            <p>No citizen reports available.</p>
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Park</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported By</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.report_type}</td>
                    <td>{report.park_name}</td>
                    <td>{report.description}</td>
                    <td>{report.priority}</td>
                    <td>{report.status}</td>
                    <td>{report.reported_by}</td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Reports;
