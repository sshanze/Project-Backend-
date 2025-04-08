import Complaint from '../models/Complaint.js';
import { sendEmail } from '../utils/emailUtils.js';


//When a faculty member resolves a complaint, we'll update the complaint status and send a notification to the student.
// When a faculty member resolves a complaint, update the status and send a notification to the student.
export const resolveComplaint = async (req, res) => {
    const { id } = req.params;
    const { status, resolutionDetails } = req.body;
    const io = req.io; // Get io from request
    try {
      // Ensure valid status
      const validStatuses = ["Resolved", "In Progress", "Pending"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
  
      // Find and update the complaint
      const complaint = await Complaint.findById(id).populate("userId");
      if (!complaint) {
        return res.status(404).json({ error: "Complaint not found" });
      }
  
      // Update complaint status and resolution details
      complaint.status = status;
      complaint.resolutionDetails = resolutionDetails;
      complaint.resolvedAt = new Date(); // Track resolution timestamp
      await complaint.save();
  
      // Emit real-time notification
      io.emit("complaintResolved", {
        complaintId: complaint._id,
        status: complaint.status,
        resolutionDetails: complaint.resolutionDetails,
      });
  
      // Send email notification to the student
      try {
        const studentEmail = complaint.userId.email;
        const emailText = `Dear ${complaint.userId.name},\n\nThe status of your complaint has been updated to: ${status}.\n\nResolution: ${resolutionDetails}\n\nThank you.`;
        await sendEmail(studentEmail, "Complaint Status Updated", emailText);
        res.status(200).json({ message: "Complaint resolved" });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
  
      res.status(200).json({ message: "Complaint resolved successfully" });
    } catch (error) {
      console.error("Error resolving complaint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  



// Complaint Filing:
// The student files a complaint under a specific category.
// Each category has a faculty member assigned to handle complaints in that category. This faculty member is automatically linked to the complaint.
// 2. Faculty Resolving the Complaint:
// The assigned faculty member reviews the complaint, and when they resolve the issue, they provide details about the resolution in the resolutionDetails field.
// This can be a textual description that explains the action they took to address the issue, as we discussed earlier.
// 3. Updating Complaint Status:
// When the faculty member resolves the complaint, they also update the complaint status to "Resolved" (or any other appropriate status, such as "Closed", etc.).
// This status update reflects on the student's dashboard so they can see that their complaint has been handled.
// 4. Sending Notification to the Student:
// Once the complaint is resolved and the status is updated, a notification is sent to the student, informing them that their complaint has been resolved.
// The notification could include the resolutionDetails, giving the student the context on how their complaint was resolved.
// 5. Student's Dashboard Update:
// On the student’s dashboard, the complaint's status will be updated to reflect that it has been resolved (e.g., "Resolved" or "Closed").
// They can view the resolutionDetails provided by the faculty, which tells them what action was taken.
