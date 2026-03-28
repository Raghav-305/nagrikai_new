const Complaint = require("../models/Complaint");
const spamCheck = require("../services/spamCheck");
const { processComplaintWithAI } = require("../services/aiOrchestrator");
const { uploadComplaintImage } = require("../services/cloudinaryService");
const { generateTicketId } = require("../utils/generateTicketId");

// Map AI department names to standardized departments
const departmentMap = {
  "Roads & Bridges PWD": "Infrastructure",
  "Water & Power Board": "Utility",
  "Traffic & Public Safety": "Public Safety",
  "Sanitation & Parks": "Environment",
};

// Function to map AI department to standard department
const mapDepartment = (aiDepartment) => {
  return departmentMap[aiDepartment] || aiDepartment || "General";
};

const extractProblemDefinition = (analysisObject = {}) => {
  const directKey = Object.keys(analysisObject).find((key) => /problem_definition/i.test(key));
  return directKey ? analysisObject[directKey] : null;
};

const normalizeActionPlan = (actionPlan) => {
  if (!actionPlan) {
    return { actionPlanText: null, actionPlanSteps: [] };
  }

  if (typeof actionPlan === "string") {
    return {
      actionPlanText: actionPlan,
      actionPlanSteps: []
    };
  }

  if (typeof actionPlan === "object") {
    const actionPlanSteps = Object.entries(actionPlan).map(([label, detail]) => ({
      label,
      detail: typeof detail === "string" ? detail : JSON.stringify(detail)
    }));

    return {
      actionPlanText: actionPlanSteps.map((step) => `${step.label}: ${step.detail}`).join("\n"),
      actionPlanSteps
    };
  }

  return { actionPlanText: null, actionPlanSteps: [] };
};

const buildAiSummary = (aiData = {}) => {
  const analysisSource =
    aiData.ai_analysis && typeof aiData.ai_analysis === "object" ? aiData.ai_analysis : {};
  const normalizedActionPlan = normalizeActionPlan(analysisSource.Action_Plan || aiData.action_plan);

  return {
    problemDefinition: extractProblemDefinition(analysisSource),
    severity: analysisSource.Severity || aiData.priority || null,
    reason: analysisSource.Reason || null,
    conclusion: analysisSource.Conclusion || null,
    actionPlanText: normalizedActionPlan.actionPlanText,
    actionPlanSteps: normalizedActionPlan.actionPlanSteps
  };
};

const sanitizeLocation = (location) => {
  if (!location || typeof location !== "object") {
    return null;
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const accuracy = location.accuracy !== undefined ? Number(location.accuracy) : null;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
    accuracy: Number.isFinite(accuracy) ? accuracy : null,
    label: typeof location.label === "string" ? location.label.slice(0, 200) : null,
    source: typeof location.source === "string" ? location.source.slice(0, 50) : "citizen-device",
    capturedAt: location.capturedAt ? new Date(location.capturedAt) : new Date(),
    mapUrl:
      typeof location.mapUrl === "string"
        ? location.mapUrl.slice(0, 500)
        : `https://maps.google.com/?q=${latitude},${longitude}`
  };
};

exports.createComplaint = async (req, res) => {
  try {
    const { text, image } = req.body;
    const location = sanitizeLocation(req.body.location);
    const locationContext = location
      ? `${location.label || `${location.latitude}, ${location.longitude}`} | Accuracy: ${location.accuracy || "unknown"} meters`
      : "";

    // Validation
    if (!text || !image) {
      return res.status(400).json({ msg: "Text and image are required" });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({ msg: "Complaint description must be at least 10 characters" });
    }

    // For testing: use a default user ID if not authenticated
    const userId = req.user?.id || "test-user-" + Date.now();

    // Check for spam/duplicates
    const spamResult = await spamCheck(text, userId);
    if (spamResult.isSpam) {
      return res.status(400).json({ msg: "Spam detected", reason: spamResult.reason });
    }

    if (spamResult.isDuplicate) {
      return res.status(400).json({ msg: "Similar complaint already exists", reason: spamResult.reason });
    }

    // Strip the data URL prefix from the image if present
    let imageBase64 = image;
    if (image.startsWith('data:')) {
      imageBase64 = image.split(',')[1]; // Extract base64 content after the comma
    }

    // Call AI Orchestrator for intelligent multi-agent analysis
    const aiResponse = await processComplaintWithAI(
      text,
      imageBase64,
      locationContext,
      new Date().toISOString()
    );

    // Determine department and priority from AI analysis
    let department = "General";
    let priority = "Medium";
    let actionPlan = "Pending assessment";
    let ticketId = generateTicketId();
    let auditorLog = "Pending";
    let uploadedImage = null;
    let aiSummary = buildAiSummary();
    let aiComplaintId = null;
    let aiMessageHistory = [];
    let aiAnalysis = null;
    let aiTicketHistory = [];
    let aiStatus = "AWAITING_FIELD_CREW";

    if (aiResponse.success && aiResponse.data) {
      department = mapDepartment(aiResponse.data.department_assigned || "General");
      let aiPriority = aiResponse.data.priority || "Medium";
      priority = aiPriority.split('(')[0].trim().toLowerCase();
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      if (!validPriorities.includes(priority)) {
        priority = 'medium';
      }
      
      // Convert action_plan to string if it's an object
      if (typeof aiResponse.data.action_plan === 'object') {
        actionPlan = JSON.stringify(aiResponse.data.action_plan);
      } else {
        actionPlan = aiResponse.data.action_plan || "Pending assessment";
      }
      
      ticketId = aiResponse.data.current_ticket_id || ticketId;
      auditorLog = aiResponse.data.status || "AWAITING_FIELD_CREW";
      aiSummary = buildAiSummary(aiResponse.data);
      aiComplaintId = aiResponse.data.complaint_id || null;
      aiMessageHistory = aiResponse.data.ai_message_log || [];
      aiAnalysis = aiResponse.data.ai_analysis || null;
      aiTicketHistory = aiResponse.data.full_ticket_history || [];
      aiStatus = aiResponse.data.status || aiStatus;
    }

    uploadedImage = await uploadComplaintImage(image, ticketId);

    const complaint = await Complaint.create({
      user: userId,
      text,
      image: uploadedImage.url,
      imagePublicId: uploadedImage.publicId,
      ticket_id: ticketId,
      ai_complaint_id: aiComplaintId,
      department,
      location,
      priority,
      action_plan: actionPlan,
      auditor_log: auditorLog,
      ai_analysis: aiAnalysis,
      ai_message_history: aiMessageHistory,
      ai_processed: aiResponse.success,
      ai_summary: aiSummary,
      ai_ticket_history: aiTicketHistory,
      status: "pending",
      deadline: aiResponse.data?.deadline || new Date()
    });

    res.status(201).json({
      success: true,
      msg: "Complaint created successfully and routed by AI",
      complaint,
      ai_info: {
        processed: aiResponse.success,
        complaint_id: aiComplaintId,
        ticket_id: ticketId,
        department,
        priority,
        deadline: aiResponse.data?.deadline || "3 days",
        status: aiStatus
      }
    });

  } catch (err) {
    console.error("Create complaint error:", err);
    res.status(500).json({ msg: "Failed to create complaint", error: err.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    // If user is authenticated, return their complaints. Otherwise return all complaints (for testing)
    const query = req.user ? { user: req.user.id } : {};
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: complaints.length,
      complaints,
      mode: req.user ? "user-specific" : "all-complaints (testing mode)"
    });
  } catch (err) {
    console.error("Get complaints error:", err);
    res.status(500).json({ msg: "Failed to fetch complaints", error: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .populate("department_notes.officer", "name email");

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Check authorization - user can see their own complaints
    if (complaint.user._id.toString() !== req.user.id && req.user.role === "citizen") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (err) {
    console.error("Get complaint error:", err);
    res.status(500).json({ msg: "Failed to fetch complaint", error: err.message });
  }
};
