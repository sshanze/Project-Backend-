import express from "express";
import { 
    changeFacultyPassword,
    fetchComplaint,
    fetchComplaintByID,
    getFacultyById,
  getFacultyComplaints, 
  getFacultyDetails, 
  getFacultyProfile, 
  resolveComplaint, 
  updateFacultyProfile
} from "../controllers/faculty.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/faculty/:id", getFacultyById);
// ✅ Get Faculty Details
router.get("/faculty-details", protectRoute(["Faculty"]), getFacultyDetails);

// ✅ Get Complaints Assigned to a Faculty Member
router.get("/faculty-complaints", protectRoute(["Faculty"]), getFacultyComplaints);

// ✅ Resolve Complaint
router.put("/resolve/:id", protectRoute(["Faculty"]), resolveComplaint);

// ✅ Get Faculty Profile (with token verification)
router.get("/profile", protectRoute(["Faculty"]), getFacultyProfile);

// ✅ Update Faculty Profile (with token verification)
router.put("/update-profile/:id", protectRoute(["Faculty"]), updateFacultyProfile);

router.put("/change-password", protectRoute(["Faculty"]), changeFacultyPassword);
router.get("/faculty-complaints",protectRoute(["Faculty"]),fetchComplaint);
router.get('/complaints/:id',protectRoute(["Faculty"]),fetchComplaintByID);
export default router;
