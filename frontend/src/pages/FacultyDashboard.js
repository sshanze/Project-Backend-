import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import logo from "../assets/logo.jpg";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("faculty_token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://localhost:5000/api/faculty/faculty-details", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch faculty details");
        return res.json();
      })
      .then((data) => {
        //console.log("Faculty Data:", data);
        setFaculty(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("faculty_token");
    navigate("/", { replace: true });
  };

  const CustomButton = ({ label, onClick, color }) => (
    <button
      className={`${color} text-white px-4 py-2 rounded-lg font-bold hover:opacity-80 transition`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-2/6 bg-blue-900 text-white p-6 flex flex-col items-center">
        <img src={logo} alt="Faculty Logo" className="w-24 h-24 mb-4 rounded-full" />
        <h1 className="text-xl font-bold">Faculty Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : faculty ? (
          <div className="mt-4 text-center w-full">
            <label className="text-gray-300 block">Faculty Name:</label>
            <input
              type="text"
              value={faculty.name || "N/A"}
              readOnly
              className="w-full bg-white text-black p-2 rounded-md mt-1 text-center"
            />
            <label className="text-gray-300 block mt-2">Department:</label>
            <input
              type="text"
              value={faculty.department || "N/A"}
              readOnly
              className="w-full bg-white text-black p-2 rounded-md mt-1 text-center"
            />
          </div>
        ) : (
          <p className="text-red-500">Faculty Data Not Found</p>
        )}

        <div className="mt-6 w-full flex flex-col gap-4">
          {faculty && faculty._id ? (
            <CustomButton
              label="Profile"
              onClick={() => navigate(`/faculty-dashboard/facultyprofile/${faculty._id}`)}
              color="bg-purple-500"
            />
          ) : (
            <p className="text-red-500">Faculty ID Not Found</p>
          )}
          <CustomButton
            label="Manage Complaints"
            onClick={() => navigate("/faculty-dashboard/manage-complaints")}
            color="bg-green-500"
          />
          <CustomButton label="Logout" onClick={handleLogout} color="bg-red-500" />
        </div>
      </div>
      <div className="w-full md:w-3/4 bg-white p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default FacultyDashboard;
