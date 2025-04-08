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
import CategoryFacultyManagement from "./pages/CategoryFacutlyManagement";
import UpdateCategory from "./pages/UpdateCategory";
import AdminProfile from "./pages/AdminProfile";
import ManageComplaints from "./pages/ManageComplaint";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="file-complaint" element={<ComplaintForm />} />
          <Route path="complaint-status" element={<ComplaintStatus />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
 
        <Route path="/change-password/:id" element={<ChangePassword />} />
        
        <Route path="/faculty-dashboard" element={<FacultyDashboard />}>
          <Route path="manage-complaints" element={<ManageComplaints />} />
          <Route path="facultyprofile/:id" element={<FacultyProfile />} />
        </Route>

        

        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-faculty" element={<AddFaculty />} />
          <Route path="category-faculty-management" element={<CategoryFacultyManagement />} />
          <Route path="admin-profile" element={<AdminProfile />} />

        </Route>
        <Route path="/admin-dashboard/category-faculty/update-categories/:id" element={<UpdateCategory />} />
       
      </Routes>
    </Router>
  );
};

export default App;
