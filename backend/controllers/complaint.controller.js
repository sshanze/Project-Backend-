import Complaint from "../models/Complaint.js";
import Category from '../models/category.js';
import User from '../models/User.js';  // To check faculty



export const fileComplaint = async (req, res) => {
  //console.log("Received complaint request:", req.body);

  try {
    const { name, email, category, description } = req.body;
    const userId = req.user.id; // Student ID from authenticated user

    //console.log("Complaint Request Details:", { name, email, category, description, file: req.file });

    // ✅ **Store Only Relative File Path**
    const fileData = req.file
      ? {
          path: `uploads/${req.file.filename}`, // ✅ Correct relative path
          size: req.file.size,
          type: req.file.mimetype,
        }
      : null;

    if (fileData) {
     // console.log("File Saved At:", fileData.path); // ✅ Debugging when a file is uploaded
    } else {
     // console.log("No file uploaded."); // ✅ Log when no file is uploaded
    }

    const student = await User.findById(userId);
    if (!student || student.role !== "Student") {
      return res.status(403).json({ error: "Unauthorized: Only students can file complaints" });
    }

    if (!student.department) {
      return res.status(400).json({ error: "Your department information is missing. Please update your profile." });
    }

    const categoryObj = await Category.findById(category).populate("facultyId");
    if (!categoryObj) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const facultyList = await User.find({
      _id: { $in: Array.isArray(categoryObj.facultyId) ? categoryObj.facultyId : [categoryObj.facultyId] },
      department: student.department,
      role: "Faculty",
    });

    if (!facultyList || facultyList.length === 0) {
      return res.status(404).json({ error: "No faculty found for this category in your department" });
    }

    const assignedFaculty = facultyList[Math.floor(Math.random() * facultyList.length)];

    const complaint = new Complaint({
      userId,
      name,
      email,
      department: student.department,
      category: categoryObj._id,
      description,
      assignedTo: assignedFaculty._id,
      file: fileData, // ✅ Fixed file storage format
    });

    await complaint.save();
    //console.log("Complaint successfully saved:", complaint);

    res.status(201).json({ message: "Complaint filed successfully", complaint });
  } catch (error) {
    console.error("Error filing complaint:", error);
    res.status(500).json({ error: "Internal server error" });
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
      .populate("assignedTo", "name")
      .populate("category", "name")
      .select("category description status assignedTo submissionDate createdAt updatedAt") // ✅ submissionDate ko include karo
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); 
  
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
  
  export async function deleteComplaint (req, res)  {
    try {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
  
      await Complaint.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

