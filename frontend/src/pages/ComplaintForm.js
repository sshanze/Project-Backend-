import React, { useState } from "react";
import logo from "../assets/logo.jpg"; // Ensure correct logo path

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollno: "",
    department: "",
    role: "",
    category: "",
    date: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Complaint submitted:", formData);
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

        {/* File Complaint Button */}
        <h2 className="w-full text-[20px] text-black py-2 rounded-md font-semibold mb-4">
          File Complaint
        </h2>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border focus:ring-2 focus:ring-blue-500"
          />

          {/* Roll Number */}
          <input
            type="text"
            name="rollno"
            value={formData.rollno}
            onChange={handleChange}
            placeholder="Roll Number"
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border focus:ring-2 focus:ring-blue-500"
          />

          {/* Department (Dropdown) */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border"
          >
            <option value="" disabled>
              Select Department
            </option>
            <option value="IT">IT</option>
            <option value="CS">CS</option>
            <option value="SE">SE</option>
            <option value="EE">EE</option>
          </select>

          {/* Role (Dropdown) */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
          </select>

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
            <option value="Harassment">Harassment</option>
            <option value="Academic">Academic</option>
            <option value="Discipline">Discipline</option>
            <option value="Hostel">Hostel</option>
          </select>

          {/* Date of Complaint */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border"
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

          {/* File Upload */}
          <div className="w-full px-3 py-2 rounded-md bg-white text-gray-800 border">
            <label className="block text-gray-700 font-medium mb-1">
              Choose File:
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
