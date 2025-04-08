// adminRoutes.js
import express from 'express';
import { addFaculty, updateFaculty, deleteFaculty, facultyList, adminInfo, AdminChangePassword, AdminUpdateProfile } from '../controllers/admin.controller.js';
import { addCategory, updateCategory, deleteCategory, categoryFacultyList, findCategory, getCategoryById } from '../controllers/category.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { getCategories } from '../controllers/user.controller.js';

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
router.get('/facultyList', protectRoute(['Admin']), facultyList);
router.post('/add-faculty', protectRoute(['Admin']), addFaculty);
router.put('/update-faculty/:id', protectRoute(['Admin']), updateFaculty);
router.delete('/delete-faculty/:id', protectRoute(['Admin']), deleteFaculty);

// Admin can add, update, and delete categories
router.get('/category-faculty-list', protectRoute(['Admin']), categoryFacultyList);

router.get('/categories',protectRoute(['Admin']),getCategories);
router.get('/find-categories', protectRoute(['Admin']),findCategory );


router.get("/category/:id", getCategoryById);

router.post('/add-categories', protectRoute(['Admin']), addCategory);
router.put('/update-categories/:id', protectRoute(['Admin']), updateCategory);
router.delete('/delete-categories/:id', protectRoute(['Admin']), deleteCategory);
router.get("/admin-info", protectRoute(['Admin']), adminInfo);
router.put("/admin-change-password", protectRoute(['Admin']), AdminChangePassword);
router.put("/admin-update-profile", protectRoute(['Admin']),AdminUpdateProfile );




export default router;
