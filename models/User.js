const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
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
  tokens: { type: Number, default: 50 }, 
  lastTokenReset: { type: Date, default: Date.now }, 
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  if (this.role !== 'employee') {
    this.tokens = undefined;
    this.lastTokenReset = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
