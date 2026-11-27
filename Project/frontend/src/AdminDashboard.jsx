
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // JWT token
  const token = localStorage.getItem("token");

  // Common Authorization headers
  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });

  const fetchComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/complaints",
        {
          method: "GET",
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Access denied. Please login again as Admin.");
        }
        throw new Error("Unable to load complaints");
      }

      const data = await response.json();
      setComplaints(data);
      setMessage("");
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
        {
          method: "PUT",
          headers: getHeaders()
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Access denied. Please login again as Admin.");
        }
        throw new Error("Status update failed");
      }

      await fetchComplaints();

      setSelectedComplaint((previous) =>
        previous?.id === id
          ? { ...previous, status }
          : previous
      );

      setMessage("Complaint status updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

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

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || complaint.status === filter;

    return matchesSearch && matchesFilter;
  });

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

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p>{total}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{inProgress}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{resolved}</p>
          </div>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search by title, user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Complaints</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <button onClick={fetchComplaints}>Refresh</button>
        </div>

        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.user?.name || "Not available"}</td>
                  <td>{complaint.user?.email || "Not available"}</td>
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

                  <td>
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <p>No matching complaints available.</p>
          )}
        </div>
      </main>

      {selectedComplaint && (
        <div className="complaint-modal-overlay">
          <div className="complaint-modal">

            <h2>Complaint Details</h2>

            <h3>User Information</h3>

            <p>
              <strong>User Name:</strong>{" "}
              {selectedComplaint.user?.name || "Not available"}
            </p>

            <p>
              <strong>User Email:</strong>{" "}
              {selectedComplaint.user?.email || "Not available"}
            </p>

            <hr />

            <h3>Complaint Information</h3>

            <p>
              <strong>Complaint ID:</strong>{" "}
              {selectedComplaint.id}
            </p>

            <p>
              <strong>Title:</strong>{" "}
              {selectedComplaint.title}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {selectedComplaint.description}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {selectedComplaint.category}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedComplaint.status}
            </p>

            <p>
              <strong>Submitted On:</strong>{" "}
              {formatDate(selectedComplaint.createdAt)}
            </p>

            <p>
              <strong>Last Updated:</strong>{" "}
              {formatDate(selectedComplaint.updatedAt)}
            </p>

            <button
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
