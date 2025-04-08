import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacultyProfile = () => {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("faculty_token"); 

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        fetch("http://localhost:5000/api/faculty/faculty-details", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized access");
                return res.json();
            })
            .then((data) => {
                setFaculty(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [token, navigate]);

    const handleSaveChanges = () => {
      if (!faculty) return;
  
      fetch(`http://localhost:5000/api/faculty/update-profile/${faculty._id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: faculty.name, department: faculty.department }),
      })
          .then((res) => res.json())
          .then(() => {
              alert("Profile Updated Successfully");
              navigate("/faculty-dashboard"); // ✅ Redirect to Faculty Dashboard
          })
          .catch((err) => console.error(err));
  };

    const handleChangePassword = () => {
      if (newPassword !== confirmPassword) {
          alert("Passwords do not match!");
          return;
      }
  
      fetch("http://localhost:5000/api/faculty/change-password", {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: faculty._id, oldPassword, newPassword }),
      })
          .then((res) => res.json())
          .then(() => {
              alert("Password Updated Successfully");
              navigate("/faculty-dashboard"); // ✅ Redirect to Faculty Dashboard
          })
          .catch((err) => console.error(err));
  };

    if (loading) return <p className="text-center text-lg text-gray-700">Loading Profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Faculty Profile</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Name:</label>
                <input
                    type="text"
                    value={faculty?.name || ""}
                    onChange={(e) => setFaculty({ ...faculty, name: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Email:</label>
                <input
                    type="email"
                    value={faculty?.email || ""}
                    disabled
                    className="w-full border rounded-lg p-2 bg-gray-100"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Department:</label>
                <input
                    type="text"
                    value={faculty?.department || ""}
                    onChange={(e) => setFaculty({ ...faculty, department: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                />
            </div>

            <button
                onClick={handleSaveChanges}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-6"
            >
                Save Changes
            </button>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">Change Password</h3>

            <input
                type="password"
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
            />
            <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
            />
            <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
            />

            <button
                onClick={handleChangePassword}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full"
            >
                Change Password
            </button>
        </div>
    );
};

export default FacultyProfile;
