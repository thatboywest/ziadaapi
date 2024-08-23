const Job = require('../models/Job');
const mongoose = require('mongoose');

// Get all jobs for the logged-in user
exports.getJobs = async (req, res) => {
  try {
    console.log('Get Jobs Request:', req.user.id);

    const jobs = await Job.find({ user: req.user.id })
      .populate('user', 'email')
      .populate('interestedUsers', 'name phone'); // Populate interested users with name and phone number

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    res.status(400).json({ error: 'Failed to retrieve jobs', details: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('user', 'name email')
      .populate('interestedUsers', 'name phone'); // Populate interested users with name and phone number

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error retrieving all jobs:', error);
    res.status(400).json({ error: 'Failed to retrieve all jobs', details: error.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log('Get Job By ID Request:', jobId);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId)
      .populate('user', 'name email')
      .populate('interestedUsers', 'name phone'); // Populate interested users with name and phone number

    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error retrieving job by ID:', error);
    res.status(400).json({ error: 'Failed to retrieve job', details: error.message });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    console.log('Create Job Request:', req.user.id);
    console.log('Request Body:', req.body);

    const job = new Job({
      ...req.body,
      user: req.user.id,
    });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(400).json({ error: 'Failed to post job', details: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log('Update Job Request:', jobId);
    console.log('Request Body:', req.body);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId).populate('user', '_id');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.user || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this job' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(400).json({ error: 'Failed to update job', details: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log('Delete Job Request:', jobId);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await job.remove();
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(400).json({ error: 'Failed to delete job', details: error.message });
  }
};

// Mark a job as done
exports.markJobAsDone = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log('Mark Job As Done Request:', jobId);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    if (!job || job.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    job.status = 'done';
    await job.save();
    res.status(200).json({ message: 'Job marked as done', job });
  } catch (error) {
    console.error('Error marking job as done:', error);
    res.status(400).json({ error: 'Failed to mark job as done', details: error.message });
  }
};
