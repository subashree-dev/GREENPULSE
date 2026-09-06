import { useEffect, useState } from "react";
import { getParks } from "../services/api";

function Parks() {
  const [parks, setParks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");

  useEffect(() => {
    getParks().then(setParks);
  }, []);

  const conditions = [
    "All",
    ...Array.from(new Set(parks.map((park) => park.condition).filter(Boolean))),
  ];

  const filteredParks = parks.filter((park) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      park.name?.toLowerCase().includes(search) ||
      park.location?.toLowerCase().includes(search) ||
      park.city?.toLowerCase().includes(search);

    const matchesCondition =
      conditionFilter === "All" || park.condition === conditionFilter;

    return matchesSearch && matchesCondition;
  });

  return (
    <div className="page">
      <header className="page-header">
        <h1>Parks</h1>
        <p>Urban parks monitored by GREENPULSE</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Park Management</h2>
          <p>
            {filteredParks.length} of {parks.length} parks displayed
          </p>
        </div>

        <div className="park-filters">
          <input
            type="text"
            placeholder="Search parks, locations or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition === "All" ? "All Conditions" : condition}
              </option>
            ))}
          </select>
        </div>

        <div className="parks-grid">
          {filteredParks.map((park) => (
            <div className="park-card" key={park.id}>
              <h3>{park.name}</h3>

              <p>
                <strong>Location:</strong> {park.location}, {park.city}
              </p>

              <p>
                <strong>Area:</strong> {park.area_sq_m} m²
              </p>

              <p>
                <strong>Condition:</strong> {park.condition}
              </p>

              <p>
                <strong>Irrigation:</strong> {park.irrigation_status}
              </p>
            </div>
          ))}
        </div>

        {filteredParks.length === 0 && (
          <div className="empty-state">
            <p>No parks match your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Parks;
