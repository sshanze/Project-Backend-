import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch faculty details and complaints from the backend
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/faculty-details"), // Fetch faculty info
      fetch("http://localhost:5000/api/faculty-complaints"), // Fetch complaints
    ])
      .then(([facultyRes, complaintsRes]) => {
        if (!facultyRes.ok || !complaintsRes.ok) {
          throw new Error("Failed to fetch data");
        }
        return Promise.all([facultyRes.json(), complaintsRes.json()]);
      })
      .then(([facultyData, complaintsData]) => {
        setFaculty(facultyData);
        setComplaints(complaintsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex bg-[#04395E] text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#032D47] p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Faculty Panel</h2>
        {faculty ? (
          <div className="text-center">
            <p className="text-lg font-semibold">{faculty.name}</p>
            <p className="text-sm text-gray-300">{faculty.department}</p>
          </div>
        ) : (
          <p>Loading faculty info...</p>
        )}
        <button
          className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-lg"
          onClick={() => navigate("/faculty/FacultyProfile")}
        >
          Profile
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-center text-3xl font-bold mb-6">Faculty Dashboard</h1>

        {/* Show loading or error messages */}
        {loading && <p className="text-center text-lg">Loading complaints...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Complaints Table */}
        {!loading && !error && complaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-white">
              <thead>
                <tr className="bg-[#04395E]">
                  <th className="border p-2">Complaint ID</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Complaint Name</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="bg-gray-800 hover:bg-gray-600 cursor-pointer"
                    onClick={() => navigate(`/faculty-dashboard/complaint/${complaint.id}`)}
                  >
                    <td className="border p-2">{complaint.id}</td>
                    <td className="border p-2">{complaint.email}</td>
                    <td className="border p-2">{complaint.name}</td>
                    <td className="border p-2">{complaint.category}</td>
                    <td className="border p-2">{complaint.title}</td>
                    <td className="border p-2">{complaint.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-center">No complaints assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
