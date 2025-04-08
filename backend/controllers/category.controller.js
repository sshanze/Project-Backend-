import Category from '../models/category.js';
import User from '../models/User.js';
import Complaint from "../models/Complaint.js"; // Import Complaint model
import mongoose from 'mongoose';


export async function findCategory(req, res)  {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoryById(req, res) {
  try {
      const category = await Category.findById(req.params.id).populate("facultyId", "name");
      if (!category) {
          return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}



export async function categoryFacultyList(req, res) {
  try {
      const categories = await Category.find().populate({
          path: 'facultyId',  
          select: 'name',  // Fetch only the faculty name
      }).lean(); // Convert Mongoose documents to plain JSON objects

      // Ensure facultyName is properly formatted
      const formattedCategories = categories.map(category => ({
          _id: category._id,
          name: category.name,
          description: category.description,
          facultyName: category.facultyId ? category.facultyId.name : "Not Assigned",
          facultyId: category.facultyId ? category.facultyId._id : null, // Include faculty ID for updates
      }));

      res.json(formattedCategories);
  } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: 'Server Error' });
  }
}

export async function addCategory(req, res) {
  const { name, description, facultyId } = req.body;
  const { role } = req.user; // Assuming role is attached to req.user

  try {
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to add categories.' });
    }
    
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'Faculty') {
      return res.status(400).json({ error: 'Invalid faculty ID or not a Faculty member' });
    }
    
    const newCategory = new Category({ name, description, facultyId });
    await newCategory.save();

    await User.findByIdAndUpdate(facultyId, {
      $push: { assignedCategories: newCategory._id },
    });

    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}






export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log("Received categoryId:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const oldFacultyId = category.facultyId; // 👀 Store old faculty ID before updating

    category.name = req.body.name;
    category.description = req.body.description;
    category.facultyId = req.body.facultyId;
    await category.save();

    // ✅ If faculty is updated, update all related complaints
    if (oldFacultyId.toString() !== req.body.facultyId) {
      await Complaint.updateMany(
        { category: id },
        { assignedTo: req.body.facultyId }
      );
    }

    res.status(200).json({ message: "Category updated successfully!" });

  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






export async function deleteCategory(req, res) {
  const { id } = req.params;
  const { role } = req.user;

  try {
    if (role !== "Admin") {
      return res.status(403).json({ message: "You are not authorized to delete categories." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove this category from assigned faculty members
    await User.updateMany(
      { role: "Faculty", assignedCategories: id }, 
      { $pull: { assignedCategories: id } } // Remove category from assignedCategories array
    );

    // Now delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted, and assigned faculty updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
