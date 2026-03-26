const Complaint = require('../models/Complaint');

// Check for duplicate/spam complaints
const checkSpam = async (description, userId) => {
  try {
    if (!description || description.trim().length < 10) {
      return { isSpam: true, reason: "Description too short" };
    }

    // Skip spam check for test users (during development)
    if (userId.includes('test-user')) {
      return { isSpam: false, isDuplicate: false };
    }

    // Check for exact duplicate from same user in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const exactDuplicate = await Complaint.findOne({
      user: userId,
      text: description.trim(),
      createdAt: { $gte: oneDayAgo },
    });

    if (exactDuplicate) {
      return { isSpam: true, reason: "Duplicate complaint" };
    }

    // Check for too many complaints from user in last 24 hours (spam)
    const userComplaintsLast24h = await Complaint.countDocuments({
      user: userId,
      createdAt: { $gte: oneDayAgo },
    });

    if (userComplaintsLast24h >= 5) {
      return { isSpam: true, reason: "Too many complaints in 24 hours" };
    }

    // Check for similar complaints from other users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const descriptionLower = description.toLowerCase();
    
    const similarComplaints = await Complaint.countDocuments({
      text: { $regex: descriptionLower.substring(0, 30), $options: "i" },
      createdAt: { $gte: sevenDaysAgo },
      user: { $ne: userId }
    });

    if (similarComplaints >= 3) {
      return { isSpam: false, isDuplicate: true, reason: "Similar complaint already exists" };
    }

    return { isSpam: false, isDuplicate: false };
  } catch (error) {
    console.error('Error checking spam:', error);
    return { isSpam: false, isDuplicate: false, error: error.message };
  }
};

module.exports = checkSpam;
