import React, { useState, useEffect } from "react";
import "./ComplaintStatus.css";

const ComplaintStatus = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch complaints from local storage or API
    const storedComplaints = JSON.parse(localStorage.getItem("userComplaints")) || [];
    setComplaints(storedComplaints);
  }, []);

  return (
    <div className="complaint-status-container">
      <h1 className="text-center text-2xl font-semibold mb-4">Your Complaints</h1>
      
      {complaints.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#04395E] text-white">
              <th className="border p-2">Complaint ID</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date Filed</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={index} className="bg-gray-100 text-center">
                <td className="border p-2">{complaint.id}</td>
                <td className="border p-2">{complaint.category}</td>
                <td className="border p-2">{complaint.description}</td>
                <td className="border p-2">{complaint.date}</td>
                <td className={`border p-2 font-semibold ${complaint.status === "Resolved" ? "text-green-600" : complaint.status === "In Progress" ? "text-yellow-600" : "text-red-600"}`}>
                  {complaint.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No complaints filed yet.</p>
      )}
    </div>
  );
};

export default ComplaintStatus;
