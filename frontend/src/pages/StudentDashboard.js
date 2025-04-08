import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Ensure correct logo path

const StudentDashboard = () => {
  const navigate = useNavigate();

  const CustomButton = ({ label, onClick, color }) => (
    <button
      className={`w-full px-4 py-2 rounded-md text-white font-bold transition duration-300 hover:opacity-80 ${color}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  const [user, setUser] = useState({
    rollno: "",
    department: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      rollno: storedUser.rollno || "N/A",
      department: storedUser.department || "N/A",
    });
  }, []);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Custom Buttons like Admin Panel) */}
      <div className="w-full sm:w-1/3 bg-[#04395E] text-white p-6 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 mb-4 rounded-full" />
        <h1 className="text-2xl font-bold text-center">
          Online Complaint Management System
        </h1>

        {/* Student Info */}
        <div className="bg-[#102e51] text-white p-4 rounded-lg mt-2 w-full  space-y-2">
          <h2 className="text-center font-semibold text-lg mb-4">Student Dashboard</h2>
          <div className="mb-4">
            <label className="block font-medium">Roll No:</label>
            <input
              type="text"
              value={user.rollno}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200 text-black"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium">Department:</label>
            <input
              type="text"
              value={user.department}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200 text-black"
            />
          </div>

          {/* Custom Sidebar Buttons */}
          <div className="space-y-2">
          <CustomButton
            label="📩 File Complaint"
            onClick={() => navigate("/student-dashboard/file-complaint")}
            color="bg-yellow-500"
          />
            <CustomButton
            label="🧑‍🎓 Profile"
            onClick={() => navigate("/student-dashboard/profile")}
            color="bg-gray-500"
          />
            <CustomButton
            label="📜 Complaint Status"
            onClick={() => navigate("/student-dashboard/complaint-status")}
            color="bg-green-500"
          />
             <CustomButton
            label=" 🔒 Logout"
            onClick={() => navigate("/student-dashboard/logout")}
            color="bg-red-500"
            className="mt-3"
          />
            
           
            
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full sm:w-2/3 bg-white p-6 shadow-md rounded-md">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;
