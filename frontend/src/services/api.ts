const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getParks() {
  return fetchJson(`${API_BASE_URL}/parks`);
}

export function getTrees() {
  return fetchJson(`${API_BASE_URL}/trees`);
}

export function getMaintenanceTasks() {
  return fetchJson(`${API_BASE_URL}/maintenance`);
}

export function getCitizenReports() {
  return fetchJson(`${API_BASE_URL}/reports`);
}

export function getEnvironmentalIndicators() {
  return fetchJson(`${API_BASE_URL}/environment`);
}
export async function createCitizenReport(data: {
  user_id: number;
  park_id: number;
  report_type: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  priority?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to create citizen report");
  }

  return response.json();
}
export async function updateMaintenanceStatus(
  taskId: number,
  status: "Pending" | "In Progress" | "Completed",
) {
  const response = await fetch(
    `${API_BASE_URL}/maintenance/${taskId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.message || "Failed to update maintenance status",
    );
  }

  return response.json();
}
