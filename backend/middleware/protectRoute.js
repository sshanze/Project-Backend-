import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export function protectRoute(requiredRoles) {
  return (req, res, next) => {
    try {
      // Get the token from cookies or Authorization header
      const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

      // Check if the token exists
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
      }

      // Verify the token
      const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({ error: 'Unauthorized: Token has expired. Please log in again.' });
      }

      // Check if the required role matches the user's role
      if (requiredRoles && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource.' });
      }

      // Attach user details to the request object
      req.user = decoded;

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
    }
  };
}
