import express from 'express';

import { login, logout, Register } from '../controllers/user.controller.js';

const router = express.Router();

// Register User
router.post('/register', Register);

// Login User
router.post('/login',login );

// Logout User
router.post('/logout',logout );

export default router;
