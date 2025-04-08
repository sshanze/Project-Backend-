import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";






// ✅ Get Faculty Profile (Fetch faculty details securely)
export const getFacultyProfile = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!faculty || faculty.role !== "Faculty") {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty profile:", error);
    res.status(500).json({ message: "Error fetching faculty profile" });
  }
};


export async function getFacultyById(req, res) {
  try {
    const { id } = req.params;

    // Fetch user where role is Faculty
    const faculty = await User.findOne({ _id: id, role: "Faculty" }).populate("assignedCategories");

    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}





// ✅ Get Faculty Details
export const getFacultyDetails = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id).select("-password");
    if (!faculty || faculty.role !== "Faculty") {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    res.status(500).json({ message: "Error fetching faculty details" });
  }
};

export const getFacultyComplaints = async (req, res) => {
  try {
    const faculty = await User.findById(req.user.id);
    if (!faculty || faculty.role !== "Faculty") {
      return res.status(403).json({ message: "Unauthorized: Only faculty members can access this" });
    }

    const complaints = await Complaint.find({ assignedTo: faculty._id })
      .populate("userId", "email")
      .populate("category", "name");

    const formattedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      studentEmail: complaint.userId.email,
      category: complaint.category.name,
      description: complaint.description,
      status: complaint.status,
      fileUrl: complaint.file?.path
        ? `${req.protocol}://${req.get("host")}/${complaint.file.path}`
        : null, // Ensure file URL is formatted correctly
    }));

    res.json(formattedComplaints);
  } catch (error) {
    console.error("Error fetching faculty complaints:", error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};




export const resolveComplaint = async (req, res) => {
  const { id } = req.params;
  const { status, resolutionDetails } = req.body;

  try {
    //console.log("🔵 Received request to update complaint:", id, "New Status:", status);

    const validStatuses = ["Resolved", "In Progress", "Rejected"];
    if (!validStatuses.includes(status)) {
      //console.log("❌ Invalid status value received");
      return res.status(400).json({ error: "Invalid status value" });
    }

    // ✅ Find the complaint
    const complaint = await Complaint.findById(id).populate("userId");
    if (!complaint) {
      console.log("❌ Complaint not found in database");
      return res.status(404).json({ error: "Complaint not found" });
    }

    //console.log("✅ Complaint found:", complaint._id, "Assigned to:", complaint.assignedTo);

    // ✅ Ensure only the assigned faculty can update it
    if (complaint.assignedTo.toString() !== req.user.id) {
     // console.log("❌ Unauthorized access attempt detected");
      return res.status(403).json({ message: "Unauthorized: You cannot update this complaint" });
    }

    // ✅ Prevent updates to already finalized complaints
    if (complaint.status === "Resolved" || complaint.status === "Rejected") {
     // console.log("❌ Complaint already finalized:", complaint.status);
      return res.status(400).json({ message: "This complaint has already been finalized and cannot be updated." });
    }

    // ✅ Update complaint status and resolution details
    complaint.status = status;
    complaint.resolutionDetails = resolutionDetails;
    complaint.resolvedAt = new Date();
    await complaint.save();

    //console.log("✅ Complaint updated in database:", complaint._id, "New Status:", complaint.status);

    // ✅ Prepare email content
const subject = `Update on Your Complaint (ID: ${complaint._id})`;
let emailMessage = `Dear ${complaint.userId.rollno},\n\nYour complaint has been updated.\n\n`;
emailMessage += `📌 **Complaint ID:** ${complaint._id}\n`;
emailMessage += `📌 **Status:** ${complaint.status}\n`;
emailMessage += `📌 **Faculty Message:** ${resolutionDetails || "No additional details provided"}\n\n`;
emailMessage += `Please check your complaint status in the portal.\n\nBest Regards,\nPUCIT Online Complaint Management System`;

    // ✅ Check if email is correct before sending
    if (!complaint.userId || !complaint.userId.email) {
      //console.log("❌ No student email found for complaint:", complaint._id);
      return res.status(400).json({ error: "Student email not found" });
    }

    //console.log("📧 Preparing to send email to:", complaint.userId.email);

    // ✅ Send Email to Student
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: complaint.userId.email, // Student’s email
      subject,
      text: emailMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
       // console.log("❌ Email sending failed:", error);
      } else {
       // console.log("✅ Email Sent Successfully to:", complaint.userId.email, "Response:", info.response);
      }
    });

    res.status(200).json({ message: "Complaint status updated successfully", complaint });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





// ✅ Update Faculty Profile
export async function updateFacultyProfile(req, res) {
  try {
    const { name, department } = req.body;
    
    if (!name || !department) {
      return res.status(400).json({ message: "Name and department are required" });
    }
    
    const updatedFaculty = await User.findOneAndUpdate(
      { _id: req.user.id, role: "Faculty" },
      { name, department },
      { new: true }
    );
    
    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    
    res.json({ message: "Profile updated successfully", updatedFaculty });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ Change Faculty Password
export async function changeFacultyPassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const faculty = await User.findOne({ _id: req.user.id, role: "Faculty" });
    
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    
    const isMatch = await bcryptjs.compare(oldPassword, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    faculty.password = await bcryptjs.hash(newPassword, 10);
    await faculty.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//its complint to be propely shown to faculty ..
export async function fetchComplaint (req, res) {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate("category", "name");

    // Add filePath to response if file exists
    const complaintsWithFileLinks = complaints.map((complaint) => ({
      ...complaint._doc,
      fileUrl: complaint.file ? `${req.protocol}://${req.get("host")}/uploads/${complaint.file}` : null,
    }));

    res.json(complaintsWithFileLinks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}


export async function fetchComplaintByID(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "email")
      .populate("category", "name")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      _id: complaint._id,
      studentEmail: complaint.userId.email,
      category: complaint.category.name,
      description: complaint.description,
      status: complaint.status,
      assignedTo: complaint.assignedTo.name,
      fileUrl: complaint.file?.path
        ? `${req.protocol}://${req.get("host")}/${complaint.file.path}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

