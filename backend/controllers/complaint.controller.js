import Complaint from "../models/Complaint.js";
import Category from '../models/category.js';
import User from '../models/User.js';  // To check faculty
import { sendEmail } from '../utils/emailUtils.js';



export const fileComplaint = async (req, res) => {
  try {
      const { name, email, category, subcategory, description } = req.body;
      const userId = req.user.id; // Student ID from authenticated user

      // Validate required fields
      if (!name || !email || !category || !subcategory || !description) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      // Find the student (authenticated user)
      const student = await User.findById(userId);
      if (!student || student.role !== 'Student') {
          return res.status(403).json({ error: 'Unauthorized: Only students can file complaints' });
      }

      // Find the category
      const categoryObj = await Category.findById(category).populate('facultyId');
      if (!categoryObj) {
          return res.status(400).json({ error: 'Invalid category' });
      }

      // Find faculty assigned to the category and ensure they belong to the student's department
      const faculty = await User.findOne({
          _id: categoryObj.facultyId,
          department: student.department, // Ensure same department
          role: 'Faculty'
      });

      if (!faculty) {
          return res.status(404).json({ error: 'No faculty found for the selected category and department' });
      }

      // Create a new complaint
      const complaint = new Complaint({
          userId,
          name,
          email,
          category: categoryObj._id, // Store category ID
          subcategory,
          description,
          assignedTo: faculty._id, // Assign the complaint to the faculty member
      });

      await complaint.save();

      // Notify faculty via email
      const emailText = `Dear ${faculty.name},

A new complaint has been filed by a student:

Student: ${student.name} (${student.email})
Category: ${categoryObj.name}
Subcategory: ${subcategory}
Description: ${description}

Please address this complaint at your earliest convenience.

Regards,
Complaint Management System`;

      // Send email with "Reply-To" as the student's email
      await sendEmail(faculty.email, 'New Complaint Assigned', emailText, student.email);

      res.status(201).json({ message: 'Complaint filed and assigned successfully', complaint });
  } catch (error) {
      console.error('Error filing complaint:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



//The trackComplaint function will return all complaints filed by the student, including the assigned faculty's name.
// The trackComplaint function will return all complaints filed by the student,
// including the assigned faculty's name and the current status of the complaint.
export async function trackComplaint(req, res) {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters
  
    try {
      // Find complaints filed by the student
      const complaints = await Complaint.find({ userId })
        .populate("assignedTo", "name") // Include faculty name
        .select("category subcategory description status assignedTo resolutionDetails createdAt updatedAt") // Include relevant fields
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }); // Sort by newest first
  
      // If no complaints found
      if (complaints.length === 0) {
        return res.status(200).json({ message: "No complaints found for this student", complaints: [] });
      }
  
      res.status(200).json({ complaints, page, limit });
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  


