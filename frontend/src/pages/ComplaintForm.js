import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg"; // Ensure correct logo path
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    date: new Date().toISOString().split("T")[0], // Set current date
    description: "",
    file: null,
  });

  const [categories, setCategories] = useState([]); // State to store categories

  // Fetch user data from backend with token verification
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("student_token");
        //console.log("📌 Checking token from localStorage:", token); // Debugging Log

        if (!token) {
          console.error("No token found. Redirecting to login.");
          window.location.href = "/";
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          name: data.name,
          email: data.email,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const selectedFile = files[0];
      if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be 10MB or less.");
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedFile,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("student_token");

      if (!token) {
        console.error("No token found. Redirecting to login.");
        window.location.href = "/";
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("description", formData.description);
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
      for (let pair of formDataToSend.entries()) {
       // console.log(pair[0], pair[1]); // Logs key-value pairs in FormData
      }
      const response = await fetch("http://localhost:5000/api/complaints/fileComplaint", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Complaint submitted successfully!");
        setFormData((prevData) => ({
          ...prevData,
          category: "",
          description: "",
          file: null,
          
        }));
        navigate("/student-dashboard");
      } else {
        alert(`Failed to submit complaint: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md border border-blue-500">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="University Logo" className="w-16 h-16 rounded-full" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl font-semibold text-black mb-4">
          Online Complaint Management System
        </h2>

        {/* File Complaint Title */}
        <h2 className="w-full text-[20px] text-black py-2 rounded-md font-semibold mb-4">
          File Complaint
        </h2>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Name (Non-editable) */}
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            placeholder="Name"
            className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 border"
          />

          {/* Email (Non-editable) */}
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            placeholder="Email"
            className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 border"
          />

          {/* Category (Dropdown) */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Date (Auto-filled, Non-editable) */}
          <input
            type="date"
            name="date"
            value={formData.date}
            readOnly
            className="w-full px-3 py-2 rounded-md bg-gray-200 text-gray-800 border"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border h-24"
          />

          {/* File Upload (Max 10MB) */}
          <div className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border">
            <label className="block text-gray-700 font-medium mb-1">
              Choose File (Max 10MB):
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
