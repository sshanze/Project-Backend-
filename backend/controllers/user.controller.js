
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function Register(req, res) {
  const { name, email, password, role, department } = req.body;

  // Check if email domain is valid (ends with @pucit.edu.pk)
  if (!email.endsWith('@pucit.edu.pk')) {
    return res.status(400).json({ error: 'Invalid email domain. Only pucit.edu.pk is allowed.' });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, department });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}



export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token as a cookie in the response
    res.cookie('auth_token', token, {
      httpOnly: true, // Prevents access to the cookie from JavaScript (security)
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
      maxAge: 3600000, // 1 hour (same as token expiration)
      sameSite: 'Strict', // Helps prevent CSRF attacks
    });

    // Send response with token in body for API consumption
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function logout(req, res) {
  // Clear the auth_token cookie by setting its expiry to a past date
  res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'strict' });

  // Send a response confirming the user has been logged out
  res.json({ message: 'Logged out successfully' });
}