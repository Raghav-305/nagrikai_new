const Complaint = require("../models/Complaint");
const { processHumanUpdateWithAI } = require("../services/aiOrchestrator");

// Map AI department names to standard departments
const departmentMap = {
  "Roads & Bridges PWD": "Infrastructure",
  "Water & Power Board": "Utility",
  "Traffic & Public Safety": "Public Safety",
  "Sanitation & Parks": "Environment",
};

// Helper to get all variants of a department name for querying
const getDepartmentVariants = (dept) => {
  const variants = [dept];
  // If it's a standard name, also add the old names
  Object.entries(departmentMap).forEach(([old, standardized]) => {
    if (standardized === dept) {
      variants.push(old);
    }
  });
  return variants;
};

const complaintBelongsToOfficerDepartment = (complaintDepartment, officerDepartment) => {
  if (!complaintDepartment || !officerDepartment) {
    return false;
  }

  const allowedDepartments = getDepartmentVariants(officerDepartment);
  return allowedDepartments.includes(complaintDepartment);
};

const normalizePriority = (priorityValue) => {
  const normalized = String(priorityValue || "medium").split("(")[0].trim().toLowerCase();
  return ["low", "medium", "high", "critical"].includes(normalized) ? normalized : "medium";
};

const buildCrewNote = (status, note, department) => {
  const trimmedNote = typeof note === "string" ? note.trim() : "";
  if (trimmedNote) {
    return trimmedNote;
  }

  if (status === "resolved") {
    return `${department || "Department"} crew marked this task as completed and the issue appears fully resolved.`;
  }

  if (status === "in-progress") {
    return `${department || "Department"} crew started work and provided a progress update.`;
  }

  return "";
};

exports.getDepartmentComplaints = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;

    const filter = {};
    
    // For officers: automatically filter by their department
    // For admins: can see all departments
    if (req.user.role === "officer") {
      const variants = getDepartmentVariants(req.user.department);
      filter.department = { $in: variants };
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Log for debugging
    console.log(
      `[${req.user.role}] ${req.user.email || req.user.id || "unknown-user"} fetching complaints for department:`,
      req.user.department
    );

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      complaints
    });
  } catch (err) {
    console.error("Get department complaints error:", err);
    res.status(500).json({ msg: "Failed to fetch complaints", error: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status || !["pending", "in-progress", "resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    if (!complaintBelongsToOfficerDepartment(complaint.department, req.user.department)) {
      return res.status(403).json({ msg: "Not authorized to update this complaint" });
    }

    complaint.status = status;
    complaint.updatedAt = Date.now();

    // Add department note if provided
    if (note) {
      complaint.department_notes.push({
        officer: req.user.id,
        note,
        timestamp: Date.now()
      });
    }

    // Set resolved timestamp if status is resolved
    if (status === "resolved") {
      complaint.resolvedAt = Date.now();
    }

    const crewNote = buildCrewNote(status, note, complaint.department);
    let aiUpdate = null;

    if (complaint.ai_complaint_id && crewNote) {
      aiUpdate = await processHumanUpdateWithAI(complaint.ai_complaint_id, crewNote);
    }

    if (aiUpdate?.success && aiUpdate.data) {
      const reroutedDepartment = aiUpdate.data.new_department_assigned;

      complaint.ticket_id = aiUpdate.data.current_ticket_id || complaint.ticket_id;
      complaint.auditor_log = aiUpdate.data.status || complaint.auditor_log;
      complaint.ai_analysis = aiUpdate.data.ai_analysis || complaint.ai_analysis;
      complaint.ai_message_history = aiUpdate.data.ai_message_log || complaint.ai_message_history;
      complaint.ai_ticket_history = aiUpdate.data.full_ticket_history || complaint.ai_ticket_history;
      complaint.deadline = aiUpdate.data.deadline || complaint.deadline;

      if (reroutedDepartment) {
        complaint.department = mapDepartmentName(reroutedDepartment);
      }

      if (aiUpdate.data.priority) {
        complaint.priority = normalizePriority(aiUpdate.data.priority);
      }

      if (aiUpdate.data.revised_action_plan) {
        complaint.action_plan =
          typeof aiUpdate.data.revised_action_plan === "object"
            ? JSON.stringify(aiUpdate.data.revised_action_plan)
            : aiUpdate.data.revised_action_plan;
      }

      if (aiUpdate.data.status === "FULLY_RESOLVED") {
        complaint.status = "resolved";
        complaint.resolvedAt = complaint.resolvedAt || Date.now();
      } else if (reroutedDepartment) {
        complaint.status = "pending";
        complaint.assignedTo = null;
        complaint.resolvedAt = null;
      }
    }

    await complaint.save();

    res.json({
      success: true,
      msg: "Complaint status updated",
      complaint,
      ai_update: aiUpdate?.data || null
    });
  } catch (err) {
    console.error("Update complaint error:", err);
    res.status(500).json({ msg: "Failed to update complaint", error: err.message });
  }
};

function mapDepartmentName(aiDepartment) {
  return departmentMap[aiDepartment] || aiDepartment || "General";
}

exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ msg: "Officer ID is required" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    if (!complaintBelongsToOfficerDepartment(complaint.department, req.user.department)) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    complaint.assignedTo = assignedTo;
    complaint.status = "in-progress";
    complaint.updatedAt = Date.now();

    await complaint.save();

    res.json({
      success: true,
      msg: "Complaint assigned",
      complaint
    });
  } catch (err) {
    console.error("Assign complaint error:", err);
    res.status(500).json({ msg: "Failed to assign complaint", error: err.message });
  }
};
