import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const CustomButton = ({ label, onClick, color }) => (
    <button
      className={`w-full px-4 py-2 rounded-md text-white font-bold transition duration-300 hover:opacity-80 ${color}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-blue-900 text-white p-6 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24 h-24 mb-4 rounded-full" />
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        {/* Admin Name */}
        <div className="mt-6 w-full">
          <label className="text-gray-300">Admin Name:</label>
          <input
            type="text"
            value="John Doe"
            readOnly
            className="w-full bg-white text-black p-2 rounded-md mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 w-full flex flex-col gap-4">
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
        </div>
      </div>

      {/* Right Content Area with Outlet */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
