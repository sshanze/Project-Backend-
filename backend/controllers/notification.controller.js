
import Notification from '../models/Notification.js';



export async function sendNotification(req,res)
{
        const { userId, message } = req.body;
      
        try {
          const notification = new Notification({
            userId,
            message,
          });
          await notification.save();
          res.status(201).json({ message: 'Notification sent successfully', notification });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      
}

export async function getNotification(req, res)  {
    const { userId } = req.params;
  
    try {
      const notifications = await Notification.find({ userId }).sort({ sentAt: -1 });
      res.status(200).json({ notifications });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

// Purpose of Notification Route, Controller, and Database
// Persistent Storage: Notifications stored in a database ensure users can retrieve past notifications even after they log out or disconnect. For example, if a student missed a real-time Socket.IO update, they can still see it later by fetching it from the database.
// Centralized Tracking: Admins or users might want to track all sent notifications for auditing or history purposes, which is only possible if they are stored in a database.
// Email Independence: Not all users check emails immediately, and real-time Socket.IO updates might be missed. Notifications provide a middle-ground mechanism for users to see updates in-app at their convenience.
// Why Not Just Use Socket.IO or Email?

// Socket.IO Limitation: Notifications sent via Socket.IO are ephemeral; if the user is offline or loses connection, they might miss critical updates.
// Email Limitation: While reliable, email is not always suitable for real-time communication and may be ignored or delayed by the user.
// Database Advantages: Combining the database with these methods provides a comprehensive solution, ensuring both persistence and immediate delivery.