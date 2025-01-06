import express from 'express';
import { getNotification, sendNotification } from '../controllers/notification.controller.js';

const router = express.Router();

// Send Notification
router.post('/send',sendNotification);

// Get Notifications for a User
router.get('/:userId',getNotification );

export default router;
