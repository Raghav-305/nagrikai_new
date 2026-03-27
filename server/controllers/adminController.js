const User = require('../models/User');
const Complaint = require('../models/Complaint');

const buildLocationFilter = (location) => {
  if (!location || typeof location !== 'string' || !location.trim()) {
    return null;
  }

  const pattern = new RegExp(location.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return {
    $or: [
      { 'location.label': pattern },
      { 'location.mapUrl': pattern },
      { text: pattern },
      { ticket_id: pattern },
      { department: pattern },
    ],
  };
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all complaints with admin filters
// @route   GET /api/admin/complaints
// @access  Private/Admin
exports.getAllComplaints = async (req, res) => {
  try {
    const { department, status, severity, location, page = 1, limit = 100 } = req.query;

    const filter = {};

    if (department && department !== 'all') {
      filter.department = department;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (severity && severity !== 'all') {
      filter['ai_summary.severity'] = new RegExp(`^${severity}$`, 'i');
    }

    const locationFilter = buildLocationFilter(location);
    if (locationFilter) {
      Object.assign(filter, locationFilter);
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit);

    const total = await Complaint.countDocuments(filter);
    const departments = await Complaint.distinct('department');
    const severities = await Complaint.distinct('ai_summary.severity');

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: numericPage,
      pages: Math.ceil(total / numericLimit),
      filtersMeta: {
        departments: departments.filter(Boolean).sort(),
        severities: severities.filter(Boolean).sort(),
      },
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({
      status: 'pending',
    });
    const inProgressComplaints = await Complaint.countDocuments({
      status: 'in-progress',
    });
    const resolvedComplaints = await Complaint.countDocuments({
      status: 'resolved',
    });

    const complaintsByDepartment = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        complaintsByDepartment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
