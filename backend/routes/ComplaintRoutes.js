import express from 'express';

import { fileComplaint, trackComplaint } from '../controllers/complaint.controller.js';
import { protectRoute } from './../middleware/protectRoute.js';
import { validateComplaint } from './../middleware/validationMiddleware.js';

const router = express.Router();

// File a Complaint
router.post('/fileComplaint',protectRoute(["Student"]),validateComplaint,fileComplaint );

// Track Complaints
router.get('/track/:userId',trackComplaint );




export default router;
