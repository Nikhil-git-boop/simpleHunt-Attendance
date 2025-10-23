const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  passwordHash: { type: String, required: true }, // hashed password
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Pre-save hook to hash password
employeeSchema.pre('save', async function(next) {
  if (this.isModified('passwordPlain')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordPlain, salt);
    this.passwordPlain = undefined;
  }
  next();
});

// Method to compare password
employeeSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Employee', employeeSchema);
