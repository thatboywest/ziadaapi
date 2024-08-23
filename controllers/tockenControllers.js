const Job = require("../models/Job");
const User = require("../models/User");

exports.sendJobInterest = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  console.log("User ID:", userId);

  try {
    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job || !user) {
      console.log("Job or User not found");
      return res.status(404).json({ error: "Job or user not found" });
    }

    console.log("User Role:", user.role);

    if (user.role !== "employee") {
      console.log("User is not an employee");
      return res
        .status(403)
        .json({ error: "Access denied or user not an employee" });
    }

    if (user.tokens < 7) {
      console.log("Not enough tokens");
      return res.status(400).json({ error: "Not enough tokens" });
    }

    if (!job.interestedUsers.includes(userId)) {
      job.interestedUsers.push(userId);
      await job.save();
    }

    user.tokens -= 7;
    await user.save();

    res.status(201).json({ message: "Job request sent successfully!" });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.showRemainingTokens = async (req, res) => {
  const userId = req.user.id;

  console.log("User ID:", userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res
        .status(403)
        .json({ error: "Access denied or user not an employee" });
    }

    console.log("User Role:", user.role);

    if (user.role !== "employee") {
      console.log("User is not an employee");
      return res
        .status(403)
        .json({ error: "Access denied or user not an employee" });
    }

    res.json({ tokens: user.tokens });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.resetTokens = async () => {
  try {
    const now = new Date();
    await User.updateMany(
      {
        role: "employee",
        $expr: {
          $gt: [{ $subtract: [now, "$lastTokenReset"] }, 12 * 60 * 60 * 1000],
        },
      },
      {
        $set: { tokens: 50, lastTokenReset: now },
      }
    );
  } catch (error) {
    console.error("Failed to reset tokens:", error.message);
  }
};
// Get job request status
exports.getJobRequestStatus = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const requestSent = job.interestedUsers.includes(userId);
    res.json({ requestSent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInterestedUsers = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  console.log('Job ID:', jobId);
  try {
    const job = await Job.findById(jobId).populate('interestedUsers', 'name email');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.user.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      jobTitle: job.jobTitle,
      interestedUsers: job.interestedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const scheduleTokenReset = () => {
  const twelveHoursInMs = 12 * 60 * 60 * 1000;
  setInterval(async () => {
    await exports.resetTokens();
  }, twelveHoursInMs);
};

scheduleTokenReset();
