// User Roles
const USER_ROLES = {
  CITIZEN: 'citizen',
  DEPARTMENT: 'department',
  ADMIN: 'admin',
};

// Complaint Status
const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

// Complaint Priority
const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Sentiment Analysis
const SENTIMENT = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

module.exports = {
  USER_ROLES,
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  SENTIMENT,
};
