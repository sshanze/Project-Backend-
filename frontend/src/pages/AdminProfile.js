import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const AdminProfile = () => {
  const navigate = useNavigate(); // ✅ Ensure useNavigate is declared
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Unauthorized! Please log in.");
      navigate("/admin-login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/adminAuthority/admin-info",
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        setAdminData({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");

      if (!adminToken) {
        setError("Unauthorized! Please log in.");
        navigate("/admin-login");
        return;
      }

      await axios.put(
        "http://localhost:5000/api/admin/adminAuthority/admin-update-profile",
        { name: adminData.name, email: adminData.email },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setMessage("Profile updated successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);

      setError("");
    } catch (error) {
      setError("Error updating profile. Try again.");
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      setError("Unauthorized! Please log in.");
      navigate("/admin-login");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/admin/adminAuthority/admin-change-password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      //console.log("Password changed successfully", response.data);
      setMessage("Password changed successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);

    } catch (error) {
      setError("Error changing password. Please try again.");
      //console.log("Error changing password:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block text-gray-700">Name:</label>
      <input
        type="text"
        name="name"
        value={adminData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block text-gray-700">Email:</label>
      <input
        type="email"
        name="email"
        value={adminData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      />

      <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 rounded">
        Save Changes
      </button>

      <h3 className="text-lg font-semibold mt-6">Change Password</h3>

      <label className="block text-gray-700">Old Password:</label>
      <input
        type="password"
        placeholder="Enter Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block text-gray-700">New Password:</label>
      <input
        type="password"
        placeholder="Enter New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block text-gray-700">Confirm New Password:</label>
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <button
        onClick={handleChangePassword}
        className="w-full bg-red-500 text-white py-2 rounded"
      >
        Change Password
      </button>
    </div>
  );
};

export default AdminProfile;
