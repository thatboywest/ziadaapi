const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  backgroundPhoto: { type: String },
  gender: { type: String },
  dob: { type: Date },
  role: { type: String, required: true, enum: ['employee', 'employer'] },
  jobTitle: { type: String },
  jobDescription: { type: String },
  county: { type: String },
  town: { type: String },
  companyName: { type: String }, 
  companyDetails: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
