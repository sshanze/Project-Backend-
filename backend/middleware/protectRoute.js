import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

const protectRoute = (req, res, next) => {
    // Get the token from the cookies
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        
        // Attach the decoded user information to the request object
        req.user = decoded; 
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export { protectRoute };
