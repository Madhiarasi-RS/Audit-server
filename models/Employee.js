const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  attendance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Employee', employeeSchema);
