import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  const studentToken = localStorage.getItem("student_token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const userId = user && user.id ? user.id.trim() : null;

  useEffect(() => {
    if (!studentToken || !userId) {
      console.warn("Unauthorized! Redirecting to login.");
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/track/${userId}`, {
          headers: { Authorization: `Bearer ${studentToken}` }
        });

        if (!response.ok) throw new Error("Failed to fetch complaints");

        const data = await response.json();
        setComplaints(data.complaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        alert("Failed to fetch complaints. Please try again.");
      }
    };

    fetchComplaints();
  }, [studentToken, userId, navigate]);

  const handleDelete = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/complaints/delete/${complaintId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${studentToken}` }
      });

      if (!response.ok) throw new Error("Failed to delete complaint");

      setComplaints(complaints.filter(complaint => complaint._id !== complaintId));
      alert("Complaint deleted successfully.");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Failed to delete complaint. Please try again.");
    }
  };

  return (
    <div className="overflow-x-auto w-full p-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-[#04395E]">
        Track Your Filed Complaints
      </h2>
      <table className="min-w-max w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#04395E] text-white">
            <th className="border p-2 whitespace-nowrap">Complaint ID</th>
            <th className="border p-2 whitespace-nowrap">Category</th>
            <th className="border p-2 whitespace-nowrap">Description</th>
            <th className="border p-2 whitespace-nowrap">Date Filed</th>
            <th className="border p-2 whitespace-nowrap">Assigned To</th>
            <th className="border p-2 whitespace-nowrap">Status</th>
            <th className="border p-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={index} className="bg-gray-100 text-center">
              <td className="border p-2">{complaint?._id || "N/A"}</td>
              <td className="border p-2">{complaint?.category?.name || "Unknown"}</td>
              <td className="border p-2 truncate max-w-xs">{complaint?.description || "No Description"}</td>
              <td className="border p-2">
                {complaint?.submissionDate ? new Date(complaint.submissionDate).toLocaleDateString() : "N/A"}
              </td>
              <td className="border p-2">
                {complaint?.assignedTo?.name || "Not Assigned"}
              </td>
              <td className="border p-2 font-semibold text-red-600">{complaint?.status || "Pending"}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(complaint._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintStatus;
