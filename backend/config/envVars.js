import dotenv from 'dotenv';

dotenv.config();

export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000, 
    JWT_SECRET_FACULTY: process.env.JWT_SECRET_FACULTY,
    JWT_SECRET_STUDENT: process.env.JWT_SECRET_STUDENT,
    JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
};

// Debugging logs to check if values are loading
// console.log("✅ MONGO_URI:", ENV_VARS.MONGO_URI);
console.log("✅ PORT:", ENV_VARS.PORT);
// console.log("✅ JWT_SECRET_FACULTY:", ENV_VARS.JWT_SECRET_FACULTY ? "Loaded" : "❌ Not Found");
// console.log("✅ JWT_SECRET_STUDENT:", ENV_VARS.JWT_SECRET_STUDENT ? "Loaded" : "❌ Not Found");
// console.log("✅ JWT_SECRET_ADMIN:", ENV_VARS.JWT_SECRET_ADMIN ? "Loaded" : "❌ Not Found");
// console.log("✅ EMAIL_USER:", ENV_VARS.EMAIL_USER ? "Loaded" : "❌ Not Found");
// console.log("✅ EMAIL_PASS:", ENV_VARS.EMAIL_PASS ? "Loaded" : "❌ Not Found");
