
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { ENV_VARS } from './../config/envVars.js';
import {sendEmail} from "../utils/sendEmail.js"; // Ensure sendEmail function is implemented


import Category from '../models/category.js';


export async function changePassword (req, res)  {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if old password matches
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);

    // Save user with new password
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Fetch all categories
export async function getCategories(req, res) {
  try {
    const categories = await Category.find().select("name"); // Only fetch category names
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function studentprofile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("name rollno email department role"); 
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,        // ✅ Sending user ID
      name: user.name,
      rollno: user.rollno,
      email: user.email,
      department: user.department
    });
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
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow updating name (department and rollno should remain unchanged)
    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    // 🔹 Choose the correct JWT secret based on the role
    let jwtSecret;
    if (user.role === "Faculty") {
      jwtSecret = ENV_VARS.JWT_SECRET_FACULTY;
    } else if (user.role === "Student") {
      jwtSecret = ENV_VARS.JWT_SECRET_STUDENT;
    } else if (user.role === "Admin") {
      jwtSecret = ENV_VARS.JWT_SECRET_ADMIN;
    } else {
      return res.status(403).json({ error: "Invalid role" });
    }

    if (!jwtSecret) {
      throw new Error("JWT secret not defined for this role");
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
        rollno: user.rollno,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}




export async function logout(req, res) {
  // Clear the auth_token cookie by setting its expiry to a past date
  res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'strict' });

  // Send a response confirming the user has been logged out
  res.json({ message: 'Logged out successfully' });
}


export async function ForgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    //console.log("User:", user); 
    // Dynamically select the JWT secret based on the user's role
    let secretKey;
    switch (user.role) {
      case 'Faculty':
        secretKey = process.env.JWT_SECRET_FACULTY;
        break;
      case 'Student':
        secretKey = process.env.JWT_SECRET_STUDENT;
        break;
      case 'Admin':
        secretKey = process.env.JWT_SECRET_ADMIN;
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    // Generate Reset Token with the correct secret key and include role
    const resetToken = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: "15m" });

    // Send Reset Email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail(user.email, "Password Reset", `Click here to reset your password: ${resetUrl}`);

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}




export async function ResetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Decode the token to extract user role and ID (no verification yet)
    const decoded = jwt.decode(token);  // Decode without verifying first to get the role
    //console.log("Decoded Token:", decoded);  // Debugging: Log decoded token data

    // Select the JWT secret based on the user's role directly here
    let secret;
    switch (decoded.role) {
      case 'Student':
        secret = process.env.JWT_SECRET_STUDENT;
        break;
      case 'Faculty':
        secret = process.env.JWT_SECRET_FACULTY;
        break;
      case 'Admin':
        secret = process.env.JWT_SECRET_ADMIN;
        break;
      default:
        return res.status(400).json({ error: 'Role not found' });
    }

    // Verify the token using the correct secret
    jwt.verify(token, secret);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error during password reset:", err);  // Log error for debugging
    res.status(400).json({ error: "Invalid or expired token" });
  }
}

