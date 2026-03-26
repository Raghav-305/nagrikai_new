const router = require("express").Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  getDepartmentComplaints,
  updateComplaintStatus,
  assignComplaint
} = require("../controllers/departmentController");

// Protected endpoint - officers can only see complaints for their department
router.get(
  "/complaints",
  protect,
  allowRoles("officer", "admin"),
  getDepartmentComplaints
);

router.put(
  "/complaint/:id/status",
  protect,
  allowRoles("officer", "admin"),
  updateComplaintStatus
);

router.put(
  "/complaint/:id/assign",
  protect,
  allowRoles("officer", "admin"),
  assignComplaint
);

module.exports = router;