import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Unauthorized! Please log in.");
      navigate("/admin-login");
      return;
    }

    if (!id) {
      setError("No category ID provided in the URL!");
      return;
    }

    // Fetch category details
    axios
      .get(`http://localhost:5000/api/admin/adminAuthority/category/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
        setFacultyId(response.data.facultyId);
      })
      .catch((err) =>
        setError("Error fetching category: " + (err.response?.data?.error || err.message))
      );

    // Fetch faculty list
    axios
      .get("http://localhost:5000/api/admin/adminAuthority/facultyList", {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      .then((response) => {
        setFacultyList(response.data);
      })
      .catch((err) =>
        setError("Error fetching faculty: " + (err.response?.data?.error || err.message))
      );
  }, [id, navigate]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      alert("Unauthorized! Please log in.");
      navigate("/admin-login");
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/admin/adminAuthority/update-categories/${id}`,
        { name, description, facultyId },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      .then(() => {
        alert("Category updated successfully!");
        navigate("/admin-dashboard/category-faculty-management"); // Redirect after success
      })
      .catch((err) =>
        setError("Error updating category: " + (err.response?.data?.error || err.message))
      );
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Category</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Select Faculty</label>
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
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
