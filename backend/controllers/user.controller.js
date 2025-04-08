
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailUtils.js'; // You can notify user after updating profile
import { ENV_VARS } from './../config/envVars.js';

export async function studentprofile(req, res)  {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Update User Profile (Including Password Change)
export async function updateStudentProfile(req, res) {
  try {
    const user = await User.findById(req.user.id); // Fetch authenticated user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If no data is sent, return the user profile (for GET request)
    if (req.method === "GET") {
      return res.json(user);
    }

    // If it's a PUT request, update only provided fields
    const { name, department } = req.body;

    if (name) user.name = name;
    if (department) user.department = department;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function updateFacultyProfile(req, res) {
  const { id } = req.user; // Faculty ID from the authenticated user
  const { name, email, department,oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);

    if (!user || user.role !== 'Faculty') {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Prevent faculty from changing their assigned category or department.
    if (req.body.category || req.body.department) {
      return res.status(403).json({ error: 'You are not allowed to change your assigned category or department.' });
    }

    // Allow updating only name, email (if valid domain), and password
    user.name = name || user.name;
    user.department = department || user.department;

    // Check if the email is valid and ends with @pucit.edu.pk
    if (email) {
      const emailRegex = /@pucit\.edu\.pk$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email must end with @pucit.edu.pk' });
      }
      user.email = email;
    }

    // If the user wants to update the password
    if (oldPassword && newPassword) {
      // Verify the old password
      const isMatch = await bcryptjs.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Old password is incorrect' });
      }

      // Hash and set the new password
      user.password = await bcryptjs.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
export async function Register(req, res) {
  const { name, rollno, email, password, role, department } = req.body; // ✅ Added rollno

  try {
    // Check if the email domain is valid (ends with @pucit.edu.pk)
    if (!email.endsWith('@pucit.edu.pk')) {
      return res.status(400).json({ error: 'Invalid email domain. Use @pucit.edu.pk' });
    }

    // Enforce that only students can register via this endpoint
    if (role && role !== 'Student') {
      return res.status(403).json({ error: 'You are not allowed to register as Faculty or Admin.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Automatically assign the role of 'Student'
    const user = new User({ name, rollno, email, password: hashedPassword, role: 'Student', department });
    await user.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error("Registration Error:", error); // ✅ Log error for debugging
    res.status(400).json({ error: error.message });
  }
}




export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Load JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not defined in environment variables");
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Send response
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        rollno: user.rollno, // ✅ Ensure rollno is included
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error); // ✅ Log full error
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



export async function logout(req, res) {
  // Clear the auth_token cookie by setting its expiry to a past date
  res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'strict' });

  // Send a response confirming the user has been logged out
  res.json({ message: 'Logged out successfully' });
}