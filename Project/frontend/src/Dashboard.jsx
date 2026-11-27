import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/complaints/user/${user.id}`
      );

      if (!response.ok) {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/api/complaints?userId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            category,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Complaint submission failed");
      }

      setMessage("Complaint submitted successfully!");
      setTitle("");
      setDescription("");
      setCategory("Technical");

      fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    }
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
            complaints.map((complaint) => (
              <div className="complaint-card" key={complaint.id}>
                <h4>{complaint.title}</h4>
                <p>{complaint.description}</p>
                <p>Category: {complaint.category}</p>
                <p>Status: {complaint.status}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;