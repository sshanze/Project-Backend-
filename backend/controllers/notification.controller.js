
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