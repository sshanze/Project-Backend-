import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ roll: '', department: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch("http://localhost:5000/api/users/sprofile", {
      method: "GET", // ✅ Corrected method
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
        console.log('Fetched Profile:', data);
        setUser(data);
        setFormData({ roll: data.roll || '', department: data.department || '' });
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
    fetch("http://localhost:5000/api/users/update-profile", { // ✅ Corrected endpoint
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
      })
      .then(() => alert('Profile updated successfully!'))
      .catch((err) => {
        console.error('Error updating profile:', err.message);
        alert('Failed to update profile.');
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-blue-900 text-2xl font-bold mb-4">Student Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-left text-blue-900 font-medium">Roll:</label>
          <input type="text" name="roll" value={formData.roll} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />

          <label className="text-left text-blue-900 font-medium">Email:</label>
          <input type="email" value={user.email || ''} disabled className="p-2 border border-gray-300 rounded-md bg-gray-200" />

          <label className="text-left text-blue-900 font-medium">Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />

          <button type="submit" className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition">Save Changes</button>
          <button type="button" onClick={() => navigate("/change-password")} className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
