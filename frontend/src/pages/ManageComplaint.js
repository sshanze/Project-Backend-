import React, { useState, useEffect } from "react";
 import axios from "axios";

 
const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [resolutionDetails, setResolutionDetails] = useState(""); // ✅ Added state

  const token = localStorage.getItem("faculty_token");

  useEffect(() => {
    fetch("http://localhost:5000/api/faculty/faculty-complaints", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Fetch individual complaint details
  const fetchComplaintDetails = (complaintId) => {
    setModalLoading(true);
    fetch(`http://localhost:5000/api/faculty/complaints/${complaintId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedComplaint(data);
        setModalLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaint details:", err);
        setModalLoading(false);
      });
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!resolutionDetails.trim()) {
      alert("Please provide resolution details before updating the status.");
      return;
    }
  
    try {
      const facultyToken = localStorage.getItem("faculty_token");
  
      if (!facultyToken) {
        console.error("Authentication failed: No faculty token found.");
        return;
      }
  
      //console.log("Updating complaint:", complaintId, "to status:", newStatus, "with resolution:", resolutionDetails);
  
      const response = await axios.put(
        `http://localhost:5000/api/faculty/resolve/${complaintId}`,
        { status: newStatus, resolutionDetails }, 
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );
  
      //console.log("Response:", response.data);
      alert("Complaint status updated successfully!");
  
      // ✅ Update the complaints state immediately (No full refresh needed)
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
        )
      );
  
      // Reset resolution details and close modal
      setResolutionDetails("");
      setSelectedComplaint(null);
    } catch (err) {
      console.error("Error updating complaint:", err.response?.data || err.message);
      alert(`Error updating complaint: ${err.response?.data?.error || err.message}`);
    }
  };
  

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Complaints</h1>

      {loading && <p className="text-center">Loading complaints...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && complaints.length === 0 && <p className="text-center">No complaints assigned yet.</p>}

      {!loading && complaints.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2">Complaint ID</th>
                <th className="border p-2">Student Email</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-100">
                  <td className="border p-2">{complaint._id}</td>
                  <td className="border p-2">{complaint.studentEmail}</td>
                  <td className="border p-2">{complaint.category}</td>
                  <td className="border p-2">{complaint.status}</td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600"
                      onClick={() => fetchComplaintDetails(complaint._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     {/* Complaint Details Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Complaint Details</h2>

              {modalLoading ? (
                <p className="text-center">Loading details...</p>
              ) : (
                <>
                  <p><strong>Student Email:</strong> {selectedComplaint.studentEmail}</p>
                  <p><strong>Category:</strong> {selectedComplaint.category}</p>
                  <p className="whitespace-pre-wrap break-words max-w-full"><strong>Description:</strong> {selectedComplaint.description}</p>
                  <p><strong>Status:</strong> {selectedComplaint.status}</p>

                  {selectedComplaint.fileUrl && (
                    <p>
                      <strong>Attachment:</strong>
                      <a 
                        href={selectedComplaint.fileUrl} 
                        className="text-blue-500" 
                        download
                      >
                        Download File
                      </a>
                    </p>
                  )}

                  {/* ✅ Added Resolution Details Input */}
                  <div className="mt-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Resolution Details:
                    </label>
                    <textarea
                      className="w-full border p-2 rounded"
                      rows="3"
                      value={resolutionDetails}
                      onChange={(e) => setResolutionDetails(e.target.value)}
                      placeholder="Enter reason for status update..."
                    ></textarea>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => updateComplaintStatus(selectedComplaint._id, "Resolved")}
                    >
                      Resolve
                    </button>

                    <button 
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={() => updateComplaintStatus(selectedComplaint._id, "In Progress")}
                    >
                      In Progress
                    </button>

                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => updateComplaintStatus(selectedComplaint._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>

                  <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setSelectedComplaint(null)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default ManageComplaints;
