
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");

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
    }
  };

  const getStatusStep = (status) => {
    if (status === "RESOLVED") return 2;
    if (status === "IN_PROGRESS") return 1;
    return 0;
  };

  const steps = ["PENDING", "IN_PROGRESS", "RESOLVED"];

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h2>Complaint Management System</h2>

        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">

        <h2>User Dashboard</h2>

        <section className="complaint-form">
          <h3>Submit New Complaint</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Complaint Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Describe your complaint"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technical">Technical</option>
              <option value="Service">Service</option>
              <option value="Billing">Billing</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit">Submit Complaint</button>
          </form>

          {message && <p>{message}</p>}
        </section>

        <section className="complaint-list">
          <h3>My Complaints</h3>

          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            complaints.map((complaint) => {
              const currentStep = getStatusStep(complaint.status);

              return (
                <div className="complaint-card" key={complaint.id}>

                  <h4>{complaint.title}</h4>

                  <p>{complaint.description}</p>

                  <p>
                    <strong>Complaint ID:</strong> {complaint.id}
                  </p>

                  <p>
                    <strong>Category:</strong> {complaint.category}
                  </p>

                  <p>
                    <strong>Submitted On:</strong>{" "}
                    {formatDate(complaint.createdAt)}
                  </p>

                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {formatDate(complaint.updatedAt)}
                  </p>

                  <p>
                    <strong>Current Status:</strong>{" "}
                    {complaint.status?.replace("_", " ")}
                  </p>

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
              );
            })
          )}
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
