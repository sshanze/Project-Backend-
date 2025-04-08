import express from 'express';
import { changePassword, ForgotPassword, getCategories, login, logout, Register, ResetPassword, studentprofile, updateFacultyProfile, updateStudentProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/reset-password/:token",ResetPassword);
  

// Forgot Password Route
router.post("/forgot-password",ForgotPassword);
// Register User
router.post('/register', Register);

// Login User
router.post('/login',login );

// Logout User
router.post('/logout',logout );

router.put("/change-password/:id", changePassword);
// Allow only student to update their own profile
router.get("/categories", getCategories);

router.get('/me', protectRoute(['Student']), studentprofile);
router.put('/updateprofile', protectRoute(['Student']), updateStudentProfile);
// Allow only faculty to update their own profile
router.put('/fprofile', protectRoute(['Faculty']), updateFacultyProfile);
export default router;
