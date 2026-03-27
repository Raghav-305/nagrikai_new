const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user: {
    type: String, // Changed to String to support both ObjectId and test user IDs
    ref: "User",
    required: [true, "User is required"]
  },
  text: {
    type: String,
    required: [true, "Complaint description is required"],
    minlength: [10, "Description must be at least 10 characters"]
  },
  image: {
    type: String,
    required: [true, "Image is required"]
  },
  imagePublicId: {
    type: String,
    default: null
  },
  ticket_id: {
    type: String,
    unique: true,
    required: [true, "Ticket ID is required"]
  },
  department: {
    type: String,
    required: [true, "Department is required"]
  },
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    accuracy: { type: Number, default: null },
    label: { type: String, default: null },
    source: { type: String, default: null },
    capturedAt: { type: Date, default: null },
    mapUrl: { type: String, default: null }
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  action_plan: {
    type: String,
    default: null
  },
  department_notes: {
    type: [{
      officer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      note: String,
      timestamp: { type: Date, default: Date.now }
    }],
    default: []
  },
  auditor_log: {
    type: String,
    default: null
  },
  // AI Orchestrator fields
  ai_analysis: {
    type: String,
    default: null,
    description: "Raw AI thought process and analysis"
  },
  ai_message_history: {
    type: [String],
    default: [],
    description: "Full message history from AI agents"
  },
  ai_processed: {
    type: Boolean,
    default: false,
    description: "Whether complaint was processed by AI orchestrator"
  },
  ai_summary: {
    problemDefinition: { type: String, default: null },
    severity: { type: String, default: null },
    reason: { type: String, default: null },
    conclusion: { type: String, default: null },
    actionPlanText: { type: String, default: null },
    actionPlanSteps: {
      type: [{
        label: String,
        detail: String
      }],
      default: []
    }
  },
  deadline: {
    type: String,
    default: "3 days",
    description: "SLA deadline from AI assessment"
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
