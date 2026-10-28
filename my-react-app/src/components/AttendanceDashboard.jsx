
import { useCallback, useEffect, useState } from "react";
import {
  getTodayAttendance,
  getAttendanceHistory,
  checkIn,
  checkOut,
} from "../services/attendanceService";
import "./AttendanceDashboard.css";

const EMPLOYEE_ID = 1002;
const EMPLOYEE_NAME = "Shubham Kumar";
const EMAIL = "abc@gmail.com";

function formatTime(time) {
  if (!time) return "--:--:--";
  const [hour, minute, second] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}:${String(second || 0).padStart(
    2, "0"
  )} ${suffix}`;
}

function formatDate(date) {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${year}-${month}-${day}`;
}

export default function AttendanceDashboard() {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getTodayAttendance(EMPLOYEE_ID),
        getAttendanceHistory(EMPLOYEE_ID),
      ]);

      const todayResult = results[0];
      const historyResult = results[1];

      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value);
      } else {
        setError(historyResult.reason.message);
      }

      if (todayResult.status === "fulfilled") {
        setToday(todayResult.value);
      } else if (
        todayResult.reason.message.includes("No attendance")
      ) {
        setToday(null);
      } else {
        setError(todayResult.reason.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCheckIn() {
    setBusy(true);
    setError("");

    try {
      await checkIn(EMPLOYEE_ID, EMPLOYEE_NAME, note);
      setNote("");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckOut() {
    setBusy(true);
    setError("");

    try {
      await checkOut(EMPLOYEE_ID);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const completed = today?.status === "COMPLETED";
  const checkedIn = Boolean(today?.checkIn);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <main className="attendance-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Attendance dashboard</h1>
          <p className="signed-in">
            Signed in as <strong>{EMAIL}</strong>
          </p>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Log out
        </button>
      </header>

      <section className="employee-strip">
        <div className="employee-info">
          <div className="avatar">S</div>
          <div>
            <p className="muted">Welcome back</p>
            <h2>{EMPLOYEE_NAME}</h2>
          </div>
        </div>

        <div className="employee-meta">
          <div>
            <span>EMPLOYEE ID</span>
            <strong>{EMPLOYEE_ID}</strong>
          </div>
          <div>
            <span>TODAY</span>
            <strong>{currentDate}</strong>
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}

      <section className="dashboard-grid">
        <article className="panel workday-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR WORKDAY</p>
              <h2>Clock in or out</h2>
            </div>
            <span className={`status-badge ${
              completed ? "completed" : "pending"
            }`}>
              {completed
                ? "Completed"
                : checkedIn
                ? "In progress"
                : "Not started"}
            </span>
          </div>

          <div className="time-summary">
            <div>
              <span>CHECK IN</span>
              <strong>{formatTime(today?.checkIn)}</strong>
            </div>
            <div>
              <span>CHECK OUT</span>
              <strong>{formatTime(today?.checkOut)}</strong>
            </div>
          </div>

          <label htmlFor="attendance-note">Note (optional)</label>
          <textarea
            id="attendance-note"
            placeholder="Add a note for today's attendance"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            disabled={checkedIn}
          />

          {!checkedIn && (
            <button
              className="primary-button"
              disabled={busy || loading}
              onClick={handleCheckIn}
            >
              {busy ? "Processing..." : "Check in for today"}
            </button>
          )}

          {checkedIn && !completed && (
            <button
              className="primary-button"
              disabled={busy || loading}
              onClick={handleCheckOut}
            >
              {busy ? "Processing..." : "Check out"}
            </button>
          )}

          {completed && (
            <button className="primary-button" disabled>
              Day completed
            </button>
          )}

          <p className="helper-text">
            Your times are recorded automatically when you mark attendance.
          </p>
        </article>

        <article className="panel history-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR RECORDS</p>
              <h2>Attendance history</h2>
            </div>

            <button
              className="refresh-button"
              onClick={loadData}
              disabled={loading || busy}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <p className="empty-message">Loading attendance...</p>
          ) : history.length === 0 ? (
            <p className="empty-message">
              No attendance records found.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Check in</th>
                    <th>Check out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDate(record.attendanceDate)}</td>
                      <td>{record.employeeName}</td>
                      <td className="check-in-time">
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="check-out-time">
                        {formatTime(record.checkOut)}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          record.status === "COMPLETED"
                            ? "completed"
                            : "pending"
                        }`}>
                          {record.status === "COMPLETED"
                            ? "Completed"
                            : "In progress"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
