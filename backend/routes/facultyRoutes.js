import express from 'express';
import { resolveComplaint} from '../controllers/faculty.controller.js';

const router = express.Router();

// Resolve Complaint
router.post('/resolve/:complaintId', resolveComplaint);

export default router;
