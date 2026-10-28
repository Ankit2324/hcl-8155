
const API = "http://localhost:8080/api/attendance";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const getTodayAttendance = (employeeId) =>
  request(`${API}/today?employeeId=${employeeId}`);

export const getAttendanceHistory = (employeeId) =>
  request(`${API}/history?employeeId=${employeeId}`);

export const checkIn = (employeeId, employeeName, note) =>
  request(`${API}/check-in`, {
    method: "POST",
    body: JSON.stringify({ employeeId, employeeName, note }),
  });

export const checkOut = (employeeId) =>
  request(`${API}/check-out?employeeId=${employeeId}`, {
    method: "POST",
  });
