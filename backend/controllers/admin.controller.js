import bcryptjs from 'bcryptjs'; // For password hashing
import User from '../models/User.js';


export async function AdminChangePassword(req, res) {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure the new password is different from the old password
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: "New password cannot be the same as the old password" });
    }

    // Ensure the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match" });
    }

    const admin = await User.findOne({ role: 'Admin' });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check if the old password is correct
    const isMatch = await bcryptjs.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    admin.password = hashedPassword;

    // Save the updated password
    await admin.save();
    
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
}

export async function AdminUpdateProfile (req, res) {
  try {
      const { name, email } = req.body;
      const adminId = req.user.id; // Assuming you set user info in middleware

      const admin = await User.findById(adminId);
      if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
      }

      admin.name = name || admin.name;
      admin.email = email || admin.email;

      await admin.save();
      res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
      res.status(500).json({ error: `Error updating profile: ${error.message}` });
  }
}
export async function adminInfo(req,res){
  try {
  const admin = await User.findOne({ role: "Admin" });
  if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
  }
  res.json({ name: admin.name, email: admin.email });
} catch (error) {
  res.status(500).json({ error: "Internal Server Error" });
}

}


export async function facultyList(req, res) {
  try {
    const facultyList = await User.find({ role: "Faculty" }).select("name _id department");
    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Add Faculty
export async function addFaculty(req, res) {
  const { name, email, department } = req.body;

  try {
    // Hash the dummy password
    const dummyPassword = await bcryptjs.hash('pucit', 10);

    // Create the faculty user
    const faculty = new User({
      name,
      rollno:null,
      email,
      role: 'Faculty',
      department,
      password: dummyPassword, // Save the hashed dummy password
    });

    await faculty.save();

    res.status(201).json({
      message: 'Faculty added successfully',
      success:true,
                user:{
                 ...faculty._doc,
                 password:"",//no need to return passwrod back to client
                },
      note: 'The faculty member has been registered with the default password: pucit',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update Faculty
export async function updateFaculty(req, res) {
  const { id } = req.params; // Faculty ID
  const { name, email, department } = req.body;

  try {
    const faculty = await User.findById(id);

    if (!faculty || faculty.role !== 'Faculty') {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Update the fields
    faculty.name = name || faculty.name;
    faculty.email = email || faculty.email;
    faculty.department = department || faculty.department;

    await faculty.save();
    res.status(200).json({ message: 'Faculty updated successfully', 
     success:true,
                user:{
                 ...faculty._doc,
                 password:"",//no need to return passwrod back to client
                },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete Faculty
export async function deleteFaculty(req, res) {
  const { id } = req.params; // Faculty ID

  try {
    const faculty = await User.findById(id);

    if (!faculty || faculty.role !== 'Faculty') {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    await faculty.deleteOne();
    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
