import User from "../models/User.js";
import { ENV_VARS } from '../config/envVars.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function adminlogincontroller(req, res){
    
    const { email, password } = req.body;

    try {
        // Check if the admin exists in the database
        const adminUser = await User.findOne({ email, role: 'Admin' });
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin not found!' });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, ENV_VARS.JWT_SECRET, {
            expiresIn: '1h', // Token valid for 1 hour
        });

        // Set the token in a secure cookie
        res.cookie('auth_token', token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: ENV_VARS.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000, // 1 hour in milliseconds
        });

        // Respond with success and token
        return res.status(200).json({
            message: 'Admin login successful!',
            token, // Optional: Return token in response body for API clients
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: 'Something went wrong. Please try again.'});
    }
}
