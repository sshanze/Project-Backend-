import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/users/change-password/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwords),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Password Updated!");
        navigate(`/student-dashboard`);
      })
      .catch((err) => alert("Error updating password"));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-blue-900 text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-left text-blue-900 font-medium">Old Password:</label>
          <input type="password" name="oldPassword" onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />

          <label className="text-left text-blue-900 font-medium">New Password:</label>
          <input type="password" name="newPassword" onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />

          <label className="text-left text-blue-900 font-medium">Confirm Password:</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />

          <button type="submit" className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition">Save Password</button>
          <button type="button" onClick={() => navigate(-1)} className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition">Back</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
