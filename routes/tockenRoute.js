const express = require('express');
const router = express.Router();
const tokenControllers = require('../controllers/tockenControllers');
const  authenticateToken  = require('../middleware/authenticateToken');

// Send job interest
router.post('/interest',authenticateToken, tokenControllers.sendJobInterest);

// Show remaining tokens
router.get('/remaining-tokens',authenticateToken, tokenControllers.showRemainingTokens);
router.get('/job/:jobId/request-status', authenticateToken,tokenControllers.getJobRequestStatus);
router.get('/job/:jobId/interested-users', authenticateToken, tokenControllers.getInterestedUsers);


module.exports = router;
