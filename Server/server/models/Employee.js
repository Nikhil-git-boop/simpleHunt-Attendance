const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String },
  passwordHash: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Compare password method
employeeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
