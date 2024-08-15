const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const  authenticateToken  = require('../middleware/authenticateToken');

// Create a new job
router.post('/jobs', authenticateToken, jobController.createJob);

// Get all jobs for the logged-in user
router.get('/jobs', authenticateToken, jobController.getJobs);

router.get('/jobs/all', authenticateToken, jobController.getAllJobs);

// Get a single job by ID
router.get('/jobs/:id', authenticateToken, jobController.getJobById);

// Update a job
router.put('/jobs/:id', authenticateToken, jobController.updateJob);

// Delete a job
router.delete('/jobs/:id', authenticateToken, jobController.deleteJob); 

// Mark a job as done
router.patch('/jobs/:id/done', authenticateToken, jobController.markJobAsDone);

module.exports = router;
