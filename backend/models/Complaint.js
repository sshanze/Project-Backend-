import mongoose from 'mongoose';

// Define the Complaint Schema
const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Student ID
  department: { type: String, required: true }, // Student's department (CS, IT, etc.)
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Complaint Category
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned Faculty
  submissionDate: { type: Date, default: Date.now },

  // ✅ Faculty's resolution details
  resolutionDetails: { type: String, default: "" }, // Faculty explanation (why resolved, rejected, etc.)
  resolvedAt: { type: Date }, // Date when it was resolved/rejected

  // File Upload Handling
  file: {
    path: { type: String }, // Store file path
    size: { type: Number }, // File size in bytes
    type: { type: String }  // MIME type (image/jpeg, application/pdf, etc.)
  }
});

// Create the model
const Complaint = mongoose.model('Complaint', ComplaintSchema);

export default Complaint;
