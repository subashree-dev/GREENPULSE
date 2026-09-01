import { useEffect, useState } from "react";
import { getParks } from "../services/api";

function Parks() {
  const [parks, setParks] = useState<any[]>([]);

  useEffect(() => {
    getParks().then(setParks);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Parks</h1>
        <p>Urban parks monitored by GREENPULSE</p>
      </header>

      <main className="page-content">
        <div className="section-title">
          <h2>Park Management</h2>
          <p>{parks.length} parks currently registered</p>
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
                <strong>Condition:</strong> {park.condition}
              </p>

              <p>
                <strong>Irrigation:</strong> {park.irrigation_status}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Parks;
