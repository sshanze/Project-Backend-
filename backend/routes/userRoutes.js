import express from 'express';

import { login, logout, Register, studentprofile, updateFacultyProfile, updateStudentProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Register User
router.post('/register', Register);

// Login User
router.post('/login',login );

// Logout User
router.post('/logout',logout );


// Allow only student to update their own profile
router.put('/sprofile', protectRoute(['Student']), studentprofile);
router.put('/updatesprofile', protectRoute(['Student']), updateStudentProfile);
// Allow only faculty to update their own profile
router.put('/fprofile', protectRoute(['Faculty']), updateFacultyProfile);
export default router;
