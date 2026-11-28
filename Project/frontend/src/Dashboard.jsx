
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/complaints/user/${user.id}`,
        {
          method: "GET",
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Access denied. Please login again.");
        }
        throw new Error("Could not fetch complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/complaints?userId=${user.id}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            title,
            description,
            category
          })
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Access denied. Please login again.");
        }
        throw new Error("Complaint submission failed");
      }

      setMessage("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory("Technical");

      await fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    if (status === "RESOLVED") return 2;
    if (status === "IN_PROGRESS") return 1;
    return 0;
  };

  const getStatusClass = (status) => {
    if (status === "RESOLVED") return "resolved";
    if (status === "IN_PROGRESS") return "in-progress";
    return "pending";
  };

  const steps = ["PENDING", "IN_PROGRESS", "RESOLVED"];

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleString("en-IN");
  };

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === "PENDING"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">⚖</span>
          <div>
            <h2>Resolve<span>.</span></h2>
            <p>Complaint Management System</p>
          </div>
        </div>

        <div className="dashboard-user-actions">
          <div className="dashboard-welcome">
            <span className="welcome-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
          <button className="dashboard-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="user-page-heading">
          <div>
            <span className="user-eyebrow">YOUR PERSONAL SPACE</span>
            <h1>User Dashboard</h1>
            <p>Submit concerns and keep track of every update.</p>
          </div>
          <button
            className="refresh-complaints"
            onClick={fetchComplaints}
            type="button"
          >
            ↻ Refresh
          </button>
        </section>

        <section className="user-stats">
          <div className="user-stat-card total-stat">
            <div className="user-stat-icon">▤</div>
            <div>
              <span>Total Complaints</span>
              <strong>{total}</strong>
            </div>
          </div>

          <div className="user-stat-card pending-stat">
            <div className="user-stat-icon">◷</div>
            <div>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>
          </div>

          <div className="user-stat-card progress-stat">
            <div className="user-stat-icon">↗</div>
            <div>
              <span>In Progress</span>
              <strong>{inProgress}</strong>
            </div>
          </div>

          <div className="user-stat-card resolved-stat">
            <div className="user-stat-icon">✓</div>
            <div>
              <span>Resolved</span>
              <strong>{resolved}</strong>
            </div>
          </div>
        </section>

        <section className="complaint-form">
          <div className="section-heading">
            <div>
              <span className="user-eyebrow">RAISE YOUR CONCERN</span>
              <h2>Submit New Complaint</h2>
              <p>Provide the details below so the team can assist you.</p>
            </div>
            <div className="form-heading-icon">✎</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="complaint-title">Complaint Title</label>
              <input
                id="complaint-title"
                type="text"
                placeholder="Enter a short title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="complaint-description">Description</label>
              <textarea
                id="complaint-description"
                placeholder="Describe your complaint in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="complaint-category">Category</label>
              <select
                id="complaint-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technical">Technical</option>
                <option value="Service">Service</option>
                <option value="Billing">Billing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="submit-complaint" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
              <span>→</span>
            </button>
          </form>

          {message && (
            <p
              className={`dashboard-message ${
                message.toLowerCase().includes("success") ? "success" : "error"
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </section>

        <section className="complaint-list">
          <div className="section-heading complaint-list-heading">
            <div>
              <span className="user-eyebrow">COMPLAINT HISTORY</span>
              <h2>My Complaints</h2>
              <p>Review your submissions and track their current progress.</p>
            </div>
            <span className="complaint-count">{total} Total</span>
          </div>

          {complaints.length === 0 ? (
            <div className="empty-complaints">
              <div className="empty-icon">▤</div>
              <h3>No complaints yet</h3>
              <p>Your submitted complaints will appear here.</p>
            </div>
          ) : (
            <div className="complaint-cards">
              {complaints.map((complaint) => {
                const currentStep = getStatusStep(complaint.status);

                return (
                  <article className="complaint-card" key={complaint.id}>
                    <div className="complaint-card-top">
                      <div>
                        <span className="complaint-id">
                          COMPLAINT #{complaint.id}
                        </span>
                        <h3>{complaint.title}</h3>
                      </div>
                      <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                        {complaint.status?.replace("_", " ")}
                      </span>
                    </div>

                    <p className="complaint-description">
                      {complaint.description}
                    </p>

                    <div className="complaint-meta">
                      <div>
                        <span>Category</span>
                        <strong>{complaint.category}</strong>
                      </div>
                      <div>
                        <span>Submitted On</span>
                        <strong>{formatDate(complaint.createdAt)}</strong>
                      </div>
                      <div>
                        <span>Last Updated</span>
                        <strong>{formatDate(complaint.updatedAt)}</strong>
                      </div>
                    </div>

                    <div className="tracking-area">
                      <h4>Complaint Tracking</h4>
                      <div className="tracking-timeline">
                        {steps.map((step, index) => (
                          <div
                            className={`tracking-step ${
                              index <= currentStep ? "completed" : ""
                            }`}
                            key={step}
                          >
                            <div className="tracking-circle">
                              {index < currentStep ? "✓" : index + 1}
                            </div>
                            <span>{step.replace("_", " ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="user-dashboard-footer">
          © 2026 Resolve. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
