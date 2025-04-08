import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { deleteComplaint, fileComplaint, trackComplaint } from "../controllers/complaint.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { validateComplaint } from "../middleware/validationMiddleware.js";

const router = express.Router();

// ✅ Ensure files go inside "backend/uploads/" folder
const uploadDir = path.join(process.cwd(), "backend/uploads");

// ✅ Ensure the uploads directory exists inside `backend/`
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  //console.log("✅ 'backend/uploads/' folder created successfully");
}

// ✅ Configure Multer to store files in `backend/uploads/`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 10MB limit
});

// ✅ File a Complaint (with file upload)
router.post("/fileComplaint", protectRoute(["Student"]), upload.single("file"), validateComplaint, fileComplaint);

// ✅ Track Complaints
router.get("/track/:userId", protectRoute(["Student"]), trackComplaint);

// ✅ Delete Complaint
router.delete("/delete/:id", deleteComplaint);

export default router;
