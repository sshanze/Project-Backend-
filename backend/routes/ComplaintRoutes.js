import express from 'express';

import { fileComplaint, resolveComplaint, trackComplaint } from '../controllers/complaint.controller.js';

const router = express.Router();

// File a Complaint
router.post('/file',fileComplaint );

// Track Complaints
router.get('/track/:userId',trackComplaint );

// Resolve Complaint
router.post('/resolve/:complaintId', resolveComplaint);

export default router;
