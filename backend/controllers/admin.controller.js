import bcryptjs from 'bcryptjs'; // For password hashing
import User from '../models/User.js';

// Add Faculty
export async function addFaculty(req, res) {
  const { name, email, department } = req.body;

  try {
    // Hash the dummy password
    const dummyPassword = await bcryptjs.hash('pucit', 10);

    // Create the faculty user
    const faculty = new User({
      name,
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
