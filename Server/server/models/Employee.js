const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const employeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  passwordHash: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Hash password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
