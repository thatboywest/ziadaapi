const Job = require('../models/Job');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('user', 'email'); // Populate user email
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve jobs', details: error.message });
  }
};
// Create a new job
exports.createJob = async (req, res) => {
  try {
    console.log('User:', req.user); // Check if the user is correctly authenticated
    console.log('Request Body:', req.body); // Check the data being sent

    const job = new Job({
      ...req.body,
      user: req.user.id, 
    });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error posting job:', error); // Log the error details
    res.status(400).json({ error: 'Failed to post job', details: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
   
    const jobs = await Job.find().populate('user', 'name email');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve jobs', details: error.message });
  }
};

// Get all jobs or jobs by the logged-in user
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve jobs', details: error.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('user', 'name email');
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve job', details: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update job', details: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found' });
    }
    await job.remove();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete job', details: error.message });
  }
};

// Mark a job as done
exports.markJobAsDone = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.status = 'done';
    await job.save();
    res.status(200).json({ message: 'Job marked as done', job });
  } catch (error) {
    res.status(400).json({ error: 'Failed to mark job as done', details: error.message });
  }
};
