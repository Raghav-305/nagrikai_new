const router = require("express").Router();
const {
  createComplaint,
  getUserComplaints,
  getComplaintById
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createComplaint); // Public endpoint for testing
router.get("/", getUserComplaints); // Public endpoint for testing
router.get("/:id", protect, getComplaintById);

module.exports = router;