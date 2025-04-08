import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard"; 
import ComplaintForm from "./pages/ComplaintForm"; 
import ComplaintStatus from "./pages/ComplaintStatus";
import FacultyProfile from "./pages/FacultyProfile";
import StudentProfile from "./pages/StudentProfile";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategory from "./pages/AddCategory";
import AddFaculty from "./pages/AddFaculty";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="file-complaint" element={<ComplaintForm />} />
          <Route path="complaint-status" element={<ComplaintStatus />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/change-password" element={<ChangePassword />} />
        

        {/* Faculty Dashboard Route */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/:id" element={<FacultyProfile/>} />


        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-faculty" element={<AddFaculty />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
