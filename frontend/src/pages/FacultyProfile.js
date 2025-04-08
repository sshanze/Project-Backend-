import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FacultyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", department: "" });

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setFormData({ name: data.name, department: data.department || "" });
      })
      .catch(err => console.error("Error fetching profile", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(() => alert("Profile updated!"))
      .catch(err => alert("Update failed"));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Faculty Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" value={user.email} disabled />

        <label>Department:</label>
        <input type="text" name="department" value={formData.department} onChange={handleChange} />

        <button type="submit">Save Changes</button>
      </form>
      <button onClick={() => navigate(`/change-password/${id}`)}>Change Password</button>
    </div>
  );
};

export default FacultyProfile;
