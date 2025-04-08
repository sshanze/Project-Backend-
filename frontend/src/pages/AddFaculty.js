import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFaculty = () => {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const adminToken = localStorage.getItem("admin_token");

      if (!adminToken) {
        setError("Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/admin/adminAuthority/add-faculty",
        { name, email, department, role: "Faculty" },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      alert("Faculty Added Successfully!");
      setName("");
      setEmail("");
      setDepartment("");
      navigate("/admin-dashboard");

    } catch (err) {
      setError("Error adding faculty: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Faculty</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-gray-700">PUCIT Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-gray-700">Department</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700" disabled={loading}>
            {loading ? "Adding..." : "Add Faculty"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
