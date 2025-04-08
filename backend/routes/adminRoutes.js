// adminRoutes.js
import express from 'express';
import { addFaculty, updateFaculty, deleteFaculty } from '../controllers/admin.controller.js';
import { addCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Step 2: Function to Add a User
router.post("/addAdmin", protectRoute(['Admin']), async (req, res) => {
    try {
        const userData = req.body; // Get user data from the request body

        // Check if the role is "Admin" and ensure there's only one admin
        if (userData.role === "Admin") {
            const existingAdmin = await User.findOne({ role: "Admin" });
            if (existingAdmin) {
                return res
                    .status(400) // Bad Request
                    .json({ error: "An admin already exists in the database. No new admin can be added." });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        // Save the new user
        const newUser = new User(userData);
        await newUser.save();

        // Return a success response
        res.status(201).json({ message: `${userData.role} added successfully!` });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: `Error: ${error.message}` });
    }
});



// Admin can add, update, and delete faculty
router.post('/faculty', protectRoute(['Admin']), addFaculty);
router.put('/faculty/:id', protectRoute(['Admin']), updateFaculty);
router.delete('/faculty/:id', protectRoute(['Admin']), deleteFaculty);

// Admin can add, update, and delete categories
router.post('/category', protectRoute(['Admin']), addCategory);
router.put('/category/:id', protectRoute(['Admin']), updateCategory);
router.delete('/category/:id', protectRoute(['Admin']), deleteCategory);

export default router;
