import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export function protectRoute(requiredRoles) {
  return (req, res, next) => {
    try {
      const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided." });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, ENV_VARS.JWT_SECRET_FACULTY);
      } catch {
        try {
          decoded = jwt.verify(token, ENV_VARS.JWT_SECRET_STUDENT);
        } catch {
          try {
            decoded = jwt.verify(token, ENV_VARS.JWT_SECRET_ADMIN);
          } catch {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
          }
        }
      }

      if (requiredRoles && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: You do not have permission." });
      }

      req.user = decoded;
      next();
      
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
    }
  };
}
