import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  rejectionReason: { type: String },  // Optional field for rejection reason
  sentAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;