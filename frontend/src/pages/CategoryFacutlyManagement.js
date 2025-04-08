import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomButton = ({ label, onClick, variant }) => {
  const buttonStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${buttonStyles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const CategoryFacultyManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      if (!adminToken) {
        alert("Unauthorized! Please log in.");
        navigate("/admin-login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/adminAuthority/category-faculty-list",
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = (id) => {
    navigate(`/admin-dashboard/category-faculty/update-categories/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const adminToken = localStorage.getItem("admin_token");
      await axios.delete(
        `http://localhost:5000/api/admin/adminAuthority/delete-categories/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Category & Faculty Management</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Responsive table container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr className="text-left">
                <th className="border p-3 font-semibold">Category Name</th>
                <th className="border p-3 font-semibold">Assigned Faculty</th>
                <th className="border p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border text-sm md:text-base">
                  <td className="border p-3">{category.name}</td>
                  <td className="border p-3">{category.facultyName || "Not Assigned"}</td>
                  <td className="border p-3">
                    <div className="flex flex-col md:flex-row gap-2">
                      <CustomButton
                        label="Update"
                        onClick={() => handleUpdateCategory(category._id)}
                        variant="outline"
                      />
                      <CustomButton
                        label="Delete"
                        onClick={() => handleDeleteCategory(category._id)}
                        variant="destructive"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryFacultyManagement;
