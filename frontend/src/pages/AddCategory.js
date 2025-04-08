import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFacultyList = async () => {
      try {
        const adminToken = localStorage.getItem("admin_token");

        if (!adminToken) {
          setError("Authentication failed. Please log in again.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/adminAuthority/facultyList",
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        setFacultyList(response.data);
      } catch (err) {
        setError("Error fetching faculty: " + (err.response?.data?.error || err.message));
      }
    };

    fetchFacultyList();
  }, []);

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
        "http://localhost:5000/api/admin/adminAuthority/add-categories",
        { name, description, facultyId },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      alert("Category Added Successfully!");
      setName("");
      setDescription("");
      setFacultyId("");
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Error adding category: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Assign Faculty</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Faculty</option>
              {facultyList.map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.name} - {faculty.department}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
