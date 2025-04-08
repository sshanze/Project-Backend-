import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFaculty = ({ isAdmin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [categories, setCategories] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Categories from Backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        department,
        assignedCategories,
        role: "Faculty",
      });

      alert("Faculty Added Successfully!");
      setName("");
      setEmail("");
      setDepartment("");
      setAssignedCategories([]);
    } catch (err) {
      setError("Error adding faculty. Try again.");
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
          {/* Faculty Name */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Email (Only Admin Can Edit) */}
          <div>
            <label className="block text-gray-700">PUCIT Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded-lg ${
                isAdmin ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
              placeholder="example@pucit.edu.pk"
              disabled={!isAdmin}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Assigned Categories (Only Admin Can Edit) */}
          <div>
            <label className="block text-gray-700">Assign Categories</label>
            <select
              multiple
              value={assignedCategories}
              onChange={(e) =>
                isAdmin
                  ? setAssignedCategories([...e.target.selectedOptions].map((opt) => opt.value))
                  : null
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                isAdmin ? "" : "bg-gray-200 cursor-not-allowed"
              }`}
              disabled={!isAdmin}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Faculty"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
