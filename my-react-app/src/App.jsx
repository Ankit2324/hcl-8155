
import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API = "http://localhost:8080/api/attendance";
const EMPLOYEE_ID = 1003;
const EMPLOYEE_NAME = "Ankit Pandey";
const EMPLOYEE_EMAIL = "ankit@example.com";
const EMPLOYEE_DESIGNATION = "Software Developer";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data !== null
        ? data.message || data.error || "Request failed"
        : data || `HTTP ${response.status}`
    );
  }

  return data;
}

function unwrap(data) {
  if (!data || typeof data !== "object") return data;
  return data.attendance ?? data.data ?? data;
}

function readField(record, names) {
  for (const name of names) {
    if (record?.[name] !== undefined && record[name] !== null) {
      return record[name];
    }
  }
  return null;
}

function formatTime(value) {
  if (!value) return "--:--";

  if (typeof value === "string") {
    const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

    if (match) {
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      const suffix = hour >= 12 ? "PM" : "AM";

      return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDate(record) {
  return readField(record, [
    "date",
    "attendanceDate",
    "checkInDate",
    "createdDate",
  ]);
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-CA");
}

function App() {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(Date.now());

  // Live clock and working-hours display.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendance = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      const [todayResponse, historyResponse] = await Promise.all([
        apiRequest(`${API}/today?employeeId=${EMPLOYEE_ID}`),
        apiRequest(`${API}/history?employeeId=${EMPLOYEE_ID}`),
      ]);

      const historyRecords = Array.isArray(historyResponse)
        ? historyResponse
        : historyResponse?.records ??
          historyResponse?.content ??
          historyResponse?.data ??
          [];

      const todayData = unwrap(todayResponse);

      const todayKey = formatDate(new Date().toISOString());

      const todayHistoryRecord = historyRecords.find((record) => {
        const date = getDate(record);
        return date && String(date).slice(0, 10) === todayKey;
      });

      const hasTodayRecord =
        todayData &&
        typeof todayData === "object" &&
        (
          readField(todayData, [
            "checkInTime",
            "checkinTime",
            "checkIn",
            "status",
            "attendanceStatus",
          ]) !== null
        );

      setAttendance(
        hasTodayRecord ? todayData : todayHistoryRecord ?? todayData
      );

      setHistory(Array.isArray(historyRecords) ? historyRecords : []);
    } catch (err) {
      setError(
        `${err.message}. Check that Spring Boot is running and the API URLs are correct.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const checkInTime = readField(attendance, [
    "checkInTime",
    "checkinTime",
    "check_in_time",
    "checkIn",
    "inTime",
  ]);

  const checkOutTime = readField(attendance, [
    "checkOutTime",
    "checkoutTime",
    "check_out_time",
    "checkOut",
    "outTime",
  ]);

  const status = String(
    readField(attendance, ["status", "attendanceStatus"]) || ""
  ).toUpperCase();

  const isCheckedIn =
    status === "IN_PROGRESS" ||
    status === "CHECKED_IN" ||
    Boolean(checkInTime && !checkOutTime);

  const isCompleted =
    status === "COMPLETED" ||
    status === "CHECKED_OUT" ||
    Boolean(checkInTime && checkOutTime);

  // Calculate elapsed time from today's saved check-in.
  function getStartTime(value) {
    if (!value) return null;

    if (typeof value === "string") {
      const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

      if (match) {
        const start = new Date(now);
        start.setHours(
          Number(match[1]),
          Number(match[2]),
          Number(match[3] || 0),
          0
        );
        return start.getTime();
      }
    }

    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  }

  const startTime = getStartTime(checkInTime);
  const endTime = checkOutTime ? getStartTime(checkOutTime) : now;

  const elapsedSeconds =
    startTime && (isCheckedIn || isCompleted) && endTime
      ? Math.max(0, Math.floor((endTime - startTime) / 1000))
      : 0;

  const workingHours = [
    String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0"),
    String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, "0"),
    String(elapsedSeconds % 60).padStart(2, "0"),
  ].join(":");

  async function handleAttendance(action) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (action === "check-in") {
        await apiRequest(`${API}/check-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: EMPLOYEE_ID,
            employeeName: EMPLOYEE_NAME,
            note: note.trim(),
          }),
        });

        setMessage("Check-in recorded successfully.");
        setNote("");
      } else {
        await apiRequest(
          `${API}/check-out?employeeId=${EMPLOYEE_ID}`,
          { method: "POST" }
        );

        setMessage("Check-out recorded successfully.");
      }

      await loadAttendance(false);
    } catch (err) {
      setError(err.message || "Attendance operation failed.");
      await loadAttendance(false);
    } finally {
      setBusy(false);
    }
  }

  const currentDate = new Date(now);

  return (
    <main className="attendance-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">H</div>
          <div>
            <h2>HRMS Portal</h2>
            <p>Attendance Management</p>
          </div>
        </div>

        <div className="live-clock">
          <strong>
            {currentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </strong>
          <span>
            {currentDate.toLocaleDateString([], {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      <section className="welcome">
        <p className="eyebrow">EMPLOYEE DASHBOARD</p>
        <h1>Welcome back, {EMPLOYEE_NAME}!</h1>
        <p>Keep track of your attendance and working hours.</p>
      </section>

      <section className="employee-card">
        <div className="avatar">AP</div>

        <div className="employee-details">
          <h3>{EMPLOYEE_NAME}</h3>
          <p>{EMPLOYEE_DESIGNATION}</p>
          <span>{EMPLOYEE_EMAIL}</span>
        </div>

        <div className="employee-id">
          <span>Employee ID</span>
          <strong>{EMPLOYEE_ID}</strong>
        </div>
      </section>

      {error && (
        <div className="alert error-message">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="alert success-message">{message}</div>
      )}

      <section className="summary-grid">
        <div className="summary-card">
          <div className="summary-heading">
            <span>Today's Check In</span>
            <span className="summary-icon">↗</span>
          </div>
          <h2>{formatTime(checkInTime)}</h2>
          <p>Recorded arrival time</p>
        </div>

        <div className="summary-card">
          <div className="summary-heading">
            <span>Today's Check Out</span>
            <span className="summary-icon teal">◷</span>
          </div>
          <h2>{formatTime(checkOutTime)}</h2>
          <p>Recorded departure time</p>
        </div>

        <div className="summary-card">
          <div className="summary-heading">
            <span>Working Hours</span>
            <span className="summary-icon green">◴</span>
          </div>
          <h2>{workingHours}</h2>
          <p>Live elapsed working time</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel attendance-panel">
          <div className="panel-title">
            <div>
              <h2>Today's Attendance</h2>
              <p>Manage your workday</p>
            </div>

            <span
              className={`status ${
                isCompleted ? "done" : isCheckedIn ? "active" : ""
              }`}
            >
              {isCompleted
                ? "Completed"
                : isCheckedIn
                ? "In Progress"
                : "Not Started"}
            </span>
          </div>

          <label htmlFor="attendance-note">
            Attendance note (optional)
          </label>

          <input
            id="attendance-note"
            type="text"
            placeholder="e.g. Working from office"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={busy || isCheckedIn || isCompleted}
          />

          <button
            className={`primary-button ${
              isCheckedIn ? "checkout-button" : ""
            }`}
            onClick={() =>
              handleAttendance(isCheckedIn ? "check-out" : "check-in")
            }
            disabled={busy || loading || isCompleted}
          >
            {busy
              ? "Please wait..."
              : isCompleted
              ? "Attendance Completed"
              : isCheckedIn
              ? "Check Out"
              : "Check In"}
          </button>

          <p className="helper-text">
            {isCompleted
              ? "Your attendance for today is complete."
              : isCheckedIn
              ? "You are checked in. Check out when your workday ends."
              : "Click Check In when you start your workday."}
          </p>
        </div>

        <div className="panel quick-panel">
          <h2>Attendance Overview</h2>
          <p className="quick-description">Your status for today</p>

          <div className="overview-row">
            <span>Check-in status</span>
            <strong>{checkInTime ? "Recorded" : "Pending"}</strong>
          </div>

          <div className="overview-row">
            <span>Check-out status</span>
            <strong>{checkOutTime ? "Recorded" : "Pending"}</strong>
          </div>

          <button
            className="secondary-button"
            onClick={() => loadAttendance()}
            disabled={loading || busy}
          >
            {loading ? "Refreshing..." : "↻ Refresh Attendance"}
          </button>
        </div>
      </section>

      <section className="panel history-panel">
        <div className="panel-title">
          <div>
            <h2>Recent Attendance</h2>
            <p>Your saved attendance records</p>
          </div>

          <button
            className="text-button"
            onClick={() => loadAttendance()}
            disabled={loading || busy}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="empty-message">Loading attendance...</p>
        ) : history.length === 0 ? (
          <p className="empty-message">No attendance records found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {history.map((record, index) => (
                  <tr
                    key={
                      record.id ??
                      record.attendanceId ??
                      `${getDate(record)}-${index}`
                    }
                  >
                    <td>{getDate(record) || "--"}</td>
                    <td>
                      {formatTime(
                        readField(record, [
                          "checkInTime",
                          "checkinTime",
                          "check_in_time",
                          "checkIn",
                        ])
                      )}
                    </td>
                    <td>
                      {formatTime(
                        readField(record, [
                          "checkOutTime",
                          "checkoutTime",
                          "check_out_time",
                          "checkOut",
                        ])
                      )}
                    </td>
                    <td>
                      <span className="history-status">
                        {readField(record, [
                          "status",
                          "attendanceStatus",
                        ]) || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="footer">
        HRMS Attendance Portal · React + Spring Boot + MySQL
      </footer>
    </main>
  );
}

export default App;
