const express = require('express');
const {
  getAllUsers,
  getDashboardStats,
  getAllComplaints,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, allowRoles('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/complaints', getAllComplaints);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
