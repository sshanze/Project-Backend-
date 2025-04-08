// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
console.log(response.data);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const { role } = response.data.user;
        if (role === "Student") {
          console.log("Navigating to Student Dashboard...");
          navigate("/student-dashboard");
        } else if (role === "Faculty") {
          navigate("/faculty-dashboard");
        } else if (role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          setError("Invalid role assigned.");
        }
      } else {
        setError(response.data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D3B66] p-6">
      <div className="w-full max-w-sm bg-transparent">
        <div className="flex justify-center">
          <img src={logo} alt="University Logo" className="w-20 h-20 mb-4 border rounded-full" />
        </div>

        <h2 className="text-white text-center text-2xl font-semibold mb-6">
          Online Complaint Management System
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-white block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-white block text-sm mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md bg-white text-gray-700 border-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <p className="text-sm text-white text-center cursor-pointer hover:underline">
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full bg-white text-blue-900 font-semibold py-2 rounded-md hover:bg-gray-200"
          >
            Log In
          </button>
          
          <p className="text-white">Don't have an account? 
            <a href="/signup" className="hover:underline font-bold"> Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
