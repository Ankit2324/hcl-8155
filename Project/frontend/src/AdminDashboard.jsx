import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/complaints"
      );

      if (!response.ok) {
        throw new Error("Unable to load complaints");
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

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/complaints/${id}/status?status=${status}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      setMessage("Complaint status updated successfully!");
      fetchComplaints();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-content">
        <h2>All Complaints</h2>

        {message && <p>{message}</p>}

        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.status}</td>
                  <td>
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        updateStatus(complaint.id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {complaints.length === 0 && (
            <p>No complaints available.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;