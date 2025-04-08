import Category from '../models/category.js';

export async function addCategory(req, res) {
  const { name, description, facultyId } = req.body;
  const { role } = req.user; // Assuming role is attached to req.user

  try {
    // Check if the logged-in user is an admin
    if (role !== 'Admin') {
      return res.status(403).json({ message: 'You are not authorized to add categories.' });
    }
    // Check if facultyId is a valid Faculty

    const faculty = await User.findById(facultyId);

    if (!faculty || faculty.role !== 'Faculty') {

    return res.status(400).json({ error: 'Invalid faculty ID or not a Faculty member' });

    }
    // Create new category
    const newCategory = new Category({
      name,
      description,
      facultyId,
    });

    await newCategory.save();
    res.status(201).json({
      message: 'Category added successfully',
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name, description, facultyId } = req.body;
  const { role } = req.user; // Assuming role is attached to req.user

  try {
    // Check if the logged-in user is an admin
    if (role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update categories.' });
    }

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category details
    category.name = name || category.name;
    category.description = description || category.description;
    category.facultyId = facultyId || category.facultyId;

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  const { role } = req.user; // Assuming role is attached to req.user

  try {
    // Check if the logged-in user is an admin
    if (role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete categories.' });
    }

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete the category
    await category.remove();

    res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
