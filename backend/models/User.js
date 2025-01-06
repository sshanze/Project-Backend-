import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
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
  department: { type: String }, // Only for Faculty
  assignedCategories: { type: [String] }, // Categories of complaints a faculty member can handle
});

// Export the User model using ES module syntax
export default mongoose.model('User', UserSchema);
