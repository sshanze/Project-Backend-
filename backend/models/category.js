import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty who handles this category
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
// The department of the student determines which faculty should handle the complaint.
// The faculty must be in the same department as the student to handle the complaint.
// The category links the complaint to the correct faculty member who handles it.
// Faculty members are assigned to specific categories, but their department should match the student's department for the complaint to be handled properly.