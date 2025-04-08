import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollno:"",
    email: "",
    password: "",
    department: "",
    role: "Student", // Default role set to "Student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000"; // Backend API URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Form Data being sent:", formData);
    // Validate email domain
    if (!formData.email.endsWith("@pucit.edu.pk")) {
      setError("Email must end with @pucit.edu.pk");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // On successful signup, redirect to login page
      alert("Signup successful! Please log in.");
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D3B66] p-6">
      <div className="w-full max-w-sm bg-transparent">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="University Logo" className="w-20 h-20 mb-4 border rounded-full" />
        </div>

        {/* Heading */}
        <h2 className="text-white text-center text-2xl font-semibold mb-6">
          Online Complaint Management System
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
            <label className="text-white block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Name Input */}
          <div>
            <label className="text-white block text-sm mb-1">Roll No</label>
            <input
              type="text"
              name="rollno"
              placeholder="Enter Roll no"
              value={formData.rollno}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-white block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email (@pucit.edu.pk)"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            />
            <small className="text-gray-300">Must end with @pucit.edu.pk</small>
          </div>

          {/* Department Selection */}
          <div>
            <label className="text-white block text-sm mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-white block text-sm mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-white block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-900 font-semibold py-2 rounded-md hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
