import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import logo from "../assets/logo.jpg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");
  const [isDashboardPage, setIsDashboardPage] = useState(true); 

  useEffect(() => {
    // Token Check for Authentication
    const adminToken = localStorage.getItem("admin_token");
    //console.log("Admin Token:", adminToken);
    
    if (!adminToken) {
      console.error("No admin token found. Redirecting to login...");
      navigate("/admin-login");
      return;
    }

    // ✅ Fetch Admin Info
    axios
      .get("http://localhost:5000/api/admin/adminAuthority/admin-info", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((res) => {
        //console.log("Admin API Response:", res.data);
        setAdminName(res.data.name);
      })
      .catch((err) => console.error("Error fetching admin:", err));

    // Check if the current route is the dashboard page
    setIsDashboardPage(location.pathname === "/admin-dashboard");
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-900 text-white p-6 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-4 rounded-full" />
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="mt-6 w-full">
          <label className="text-gray-300">Admin Name:</label>
          <input
            type="text"
            value={adminName}
            readOnly
            className="w-full bg-white text-black p-2 rounded-md mt-1"
          />
        </div>
        <div className="mt-6 w-full flex flex-col gap-4">
          <CustomButton
            label="Profile"
            onClick={() => navigate("/admin-dashboard/admin-profile")}
            color="bg-purple-500"
          />
          <CustomButton
            label="Add Category"
            onClick={() => navigate("/admin-dashboard/add-category")}
            color="bg-yellow-500"
          />
          <CustomButton
            label="Add Faculty"
            onClick={() => navigate("/admin-dashboard/add-faculty")}
            color="bg-green-500"
          />
          <CustomButton
            label="Category & Faculty List"
            onClick={() => navigate("/admin-dashboard/category-faculty-management")}
            color="bg-blue-500"
          />
          <CustomButton
            label="Logout"
            onClick={handleLogout}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Conditionally render the welcome message only on the dashboard page */}
        {isDashboardPage && (
          <div className="text-3xl font-semibold text-gray-700 mb-6">
            Welcome to Admin Dashboard
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
