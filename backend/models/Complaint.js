import mongoose from 'mongoose';

// Define the Complaint Schema
const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, 
  ref: 'Category', 
  required: true  },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Faculty ID
  submissionDate: { type: Date, default: Date.now },
});

// Export the Complaint model using ES module syntax
const Complaint = mongoose.model('Complaint', ComplaintSchema);

export default Complaint;
