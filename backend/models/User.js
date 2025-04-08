import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: function(v) {
        return /@pucit\.edu\.pk$/.test(v); // Only allow email ending with @pucit.edu.pk
      },
      message: props => `${props.value} is not a valid email domain!`
    }
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Faculty', 'Admin'], required: true },
  
  // Department is required for both Faculty and Student roles
  department: { 
    type: String,
    required: function() { return this.role === 'Faculty' || this.role === 'Student'; }
  },
  
  // Categories the faculty member handles (Faculty only)
  assignedCategories: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Category' 
  },
});

export default mongoose.model('User', UserSchema);
// Student files a complaint. The student's department is recorded in the system.
// The complaint has a category (e.g., IT issues, attendance issue, etc.).
// Each category is linked to a faculty member, and the faculty member has a department.
// The complaint can be assigned to the faculty member who is handling that category, but the department of the faculty must match the student's department for it to be handled correctly.
// Solution:
// To ensure the complaint is assigned properly, you need to check both the faculty's department and the category assignment. Here’s how it works:

// The student will file a complaint with a category.
// You will check if that category is assigned to a faculty member.
// Then, you will check if the faculty's department matches the student's department. If it matches, the complaint will be assigned to that faculty.
// How to Handle It in Code:
// Student Department: Each student has a department field that indicates the department they belong to.
// Faculty Department: Faculty members have a department field indicating the department they belong to. They also have assignedCategories, which are the categories they are responsible for handling.