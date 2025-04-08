import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import logo from "../assets/logo.jpg";
import Notifications from "./Notifications";

const socket = io("http://localhost:5000");

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({
    rollno: "",
    department: "",
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isComplaintPageOpen, setIsComplaintPageOpen] = useState(false);
  const [isComplaintStatusOpen, setIsComplaintStatusOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      rollno: storedUser.rollno || "N/A",
      department: storedUser.department || "N/A",
    });
  }, [navigate]);

  useEffect(() => {
    socket.on("complaintUpdated", (updatedComplaint) => {
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === updatedComplaint.complaintId
            ? { ...complaint, status: updatedComplaint.status }
            : complaint
        )
      );
    });

    return () => {
      socket.off("complaintUpdated");
    };
  }, []);

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification.message,
      ]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("student_token");
    navigate("/");
  };

  const CustomButton = ({ label, onClick, color }) => (
    <button
      className={`w-full px-4 py-2 rounded-md text-white font-bold transition duration-300 hover:opacity-80 ${color}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const handleFileComplaintClick = () => {
    if (!isComplaintPageOpen) {
      navigate("/student-dashboard/file-complaint");
    } else {
      navigate("/student-dashboard");
    }
    setIsComplaintPageOpen(!isComplaintPageOpen);
  };

  const handleComplaintStatusClick = () => {
    if (!isComplaintStatusOpen) {
      navigate("/student-dashboard/complaint-status");
    } else {
      navigate("/student-dashboard");
    }
    setIsComplaintStatusOpen(!isComplaintStatusOpen);
  };

  const handleProfileClick = () => {
    if (!isProfileOpen) {
      navigate("/student-dashboard/profile");
    } else {
      navigate("/student-dashboard");
    }
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 overflow-hidden">
      {/* ✅ Sidebar */}
      <div className="w-full sm:w-1/3 bg-[#04395E] text-white p-6 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-20 mb-4 rounded-full" />
        <h1 className="text-2xl font-bold text-center">
          Online Complaint Management System
        </h1>

        {/* ✅ Student Info */}
        <div className="bg-[#102e51] text-white p-4 rounded-lg mt-2 w-full space-y-2">
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

          {/* ✅ Sidebar Buttons */}
          <div className="space-y-2">
            <CustomButton
              label="🔔 Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              color="bg-blue-500"
            />
            <CustomButton
              label="📩 File Complaint"
              onClick={handleFileComplaintClick}
              color="bg-yellow-500"
            />
            <CustomButton
              label="🧑‍🎓 Profile"
              onClick={handleProfileClick}
              color="bg-gray-500"
            />
            <CustomButton
              label="📜 Complaint Status"
              onClick={handleComplaintStatusClick}
              color="bg-green-500"
            />
            <CustomButton
              label="🔒 Logout"
              onClick={handleLogout}
              color="bg-red-500"
              className="mt-3"
            />
          </div>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="w-full sm:w-2/3 p-6 bg-gray-100 relative">
        <h2 className="text-xl font-bold">Welcome to Dashboard</h2>
        <Outlet />

        {/* ✅ Sliding Notifications Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-md p-4 transform transition-transform ${
            showNotifications ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-red-500"
            onClick={() => setShowNotifications(false)}
          >
            ❌ Close
          </button>
          <h2 className="text-lg font-bold mb-4">🔔 Notifications</h2>
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
