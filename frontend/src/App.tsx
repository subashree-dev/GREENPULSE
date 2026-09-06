import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Parks from "./pages/Parks";
import Trees from "./pages/Trees";
import Environment from "./pages/Environment";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">🌱</div>

            <div>
              <h1>GREENPULSE</h1>
              <span>Urban Intelligence</span>
            </div>
          </div>

          <nav className="navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>📊</span>
              Dashboard
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>📋</span>
              Reports
            </NavLink>

            <NavLink
              to="/parks"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>🌳</span>
              Parks
            </NavLink>

            <NavLink
              to="/trees"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>🌲</span>
              Trees
            </NavLink>

            <NavLink
              to="/environment"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>🌍</span>
              Environment
            </NavLink>

            <NavLink
              to="/maintenance"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span>🔧</span>
              Maintenance
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="status-dot"></div>

            <div>
              <strong>System Online</strong>
              <span>GREENPULSE API connected</span>
            </div>
          </div>
        </aside>

        <div className="main-area">
          <Routes>
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Dashboard />} />

            <Route path="/parks" element={<Parks />} />

            <Route path="/trees" element={<Trees />} />

            <Route path="/environment" element={<Environment />} />

            <Route path="/maintenance" element={<Maintenance />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
