import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', rollno: '', email: '', department: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("student_token");

    fetch("http://localhost:5000/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        //console.log('Fetched Profile:', data);
        setUser(data);
        setFormData({
          
          name: data.name || '',
          rollno: data.rollno || '',
          email: data.email || '',
          department: data.department || '',
        });
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.message);
        alert('Failed to load profile.');
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/users/updateprofile", { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('student_token')}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser.user); // Update the displayed profile
        //console.log('Profile updated:', updatedUser);
        alert('Profile updated successfully!');
        navigate(`/student-dashboard`);
      })
      .catch((err) => {
        console.error('Error updating profile:', err.message);
        alert('Failed to update profile.');
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-blue-900 text-2xl font-bold mb-4">Student Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-left">
          <label className="text-blue-900 font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />

          <label className="text-blue-900 font-medium">Roll No:</label>
          <input
            type="text"
            value={formData.rollno}
            disabled
            className="p-2 border border-gray-300 rounded-md bg-gray-200"
          />

          <label className="text-blue-900 font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />

          <label className="text-blue-900 font-medium">Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            disabled
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md bg-gray-200"
          />

          <button type="submit" className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
            Update Profile
          </button>
        </form>
        <button
  type="button"
  onClick={() => {
    //console.log("Navigating with ID:", user.id); // ✅ Ensure it prints correctly
    if (!user.id) {
      console.error("Error: User ID is undefined!");
      alert("Error: User ID is missing.");
      return;
    }
    navigate(`/change-password/${user.id}`); // ✅ Use `id` instead of `_id`
  }}
  className="w-full mt-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
>
  Change Password
</button>
      </div>
    </div>
  );
};

export default StudentProfile;
