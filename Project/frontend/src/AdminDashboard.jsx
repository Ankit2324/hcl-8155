
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import AdminNotifications from "./AdminNotifications";
import "./AdminDashboard.css";

function AdminDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const token = localStorage.getItem("token");

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

  // Complaint statistics
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

  // Bar chart data
  const barData = [
    { name: "Total", complaints: total },
    { name: "Pending", complaints: pending },
    { name: "In Progress", complaints: inProgress },
    { name: "Resolved", complaints: resolved }
  ];

  // Pie chart data
  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved }
  ];

  const pieColors = ["#f59e0b", "#3b82f6", "#16a34a"];

  // Monthly complaint analytics
  const currentYear = new Date().getFullYear();

  const monthlyData = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ].map((month, index) => {
    const count = complaints.filter((complaint) => {
      if (!complaint.createdAt) return false;

      const date = new Date(complaint.createdAt);

      return (
        date.getMonth() === index &&
        date.getFullYear() === currentYear
      );
    }).length;

    return {
      month: month.substring(0, 3),
      complaints: count
    };
  });

  // Search and filter
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      complaint.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || complaint.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Export Excel Report
  const exportExcel = () => {
    const reportData = filteredComplaints.map((complaint) => ({
      "Complaint ID": complaint.id,
      "Title": complaint.title,
      "Description": complaint.description,
      "User Name": complaint.user?.name || "Not available",
      "User Email": complaint.user?.email || "Not available",
      "Category": complaint.category,
      "Status": complaint.status,
      "Submitted On": formatDate(complaint.createdAt),
      "Last Updated": formatDate(complaint.updatedAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 40 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 25 }
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Complaints"
    );

    XLSX.writeFile(
      workbook,
      "Complaint_Management_Report.xlsx"
    );

    setMessage("Excel report downloaded successfully!");
  };

  // Export PDF Report
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape"
    });

    doc.setFontSize(18);
    doc.text("Complaint Management Report", 14, 18);

    doc.setFontSize(10);
    doc.text(
      `Generated On: ${new Date().toLocaleString("en-IN")}`,
      14,
      27
    );

    doc.text(
      `Total Complaints: ${filteredComplaints.length}`,
      14,
      34
    );

    const tableData = filteredComplaints.map((complaint) => [
      complaint.id,
      complaint.title || "",
      complaint.user?.name || "Not available",
      complaint.user?.email || "Not available",
      complaint.category || "",
      complaint.status || "",
      formatDate(complaint.createdAt)
    ]);

    autoTable(doc, {
      startY: 42,
      head: [[
        "ID",
        "Title",
        "User Name",
        "User Email",
        "Category",
        "Status",
        "Submitted On"
      ]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [37, 99, 235]
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 38 },
        2: { cellWidth: 30 },
        3: { cellWidth: 48 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 40 }
      }
    });

    doc.save("Complaint_Management_Report.pdf");

    setMessage("PDF report downloaded successfully!");
  };

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <h2>Admin Dashboard</h2>

        <div className="admin-header-actions">
          <span>Welcome, {user.name}</span>

          <AdminNotifications />

          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="admin-content">

        <h2>All Complaints</h2>

        {message && <p>{message}</p>}

        {/* Statistics Cards */}
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

        {/* Analytics Charts */}
        <section className="admin-analytics">

          <h2>Complaint Analytics</h2>

          <div className="analytics-grid">

            <div className="analytics-card">
              <h3>Complaint Status Overview</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />

                  <Bar
                    dataKey="complaints"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-card">
              <h3>Status Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-card monthly-analytics">
              <h3>Monthly Complaint Trends ({currentYear})</h3>

              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="complaints"
                    name="Complaints"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>

        {/* Search and Filters */}
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

        {/* Export Buttons */}
        <div className="export-buttons">
          <button onClick={exportExcel}>
            Download Excel Report
          </button>

          <button onClick={exportPDF}>
            Download PDF Report
          </button>
        </div>

        {/* Complaints Table */}
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

                  <td>
                    {complaint.user?.name || "Not available"}
                  </td>

                  <td>
                    {complaint.user?.email || "Not available"}
                  </td>

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

      {/* Complaint Details Modal */}
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
