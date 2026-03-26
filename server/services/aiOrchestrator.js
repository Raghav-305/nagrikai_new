const axios = require('axios');

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:7860';
const AI_SERVER_TOKEN = process.env.AI_SERVER_TOKEN || 'your-secret-token-here';

/**
 * Process a complaint through the AI server for intelligent routing
 * @param {string} text - The complaint text from citizen
 * @param {string} image_base64 - Optional base64 encoded image
 * @param {string} location_text - Location of the complaint
 * @param {string} timestamp - Complaint submission timestamp
 * @returns {Promise<Object>} - AI processed ticket data
 */
async function processComplaintWithAI(text, image_base64 = '', location_text = '', timestamp = new Date().toISOString()) {
  try {
    const response = await axios.post(
      `${AI_SERVER_URL}/api/process-ticket`,
      {
        text: text,
        image_base64: image_base64,
        location_text: location_text,
        timestamp: timestamp
      },
      {
        headers: {
          'x-api-token': AI_SERVER_TOKEN,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return {
      success: true,
      data: response.data,
      aiProcessed: true
    };
  } catch (error) {
    console.error('AI Server Error:', error.message);
    
    // Fallback to basic processing if AI server is unavailable
    return {
      success: false,
      error: error.message,
      aiProcessed: false,
      fallback: true
    };
  }
}

/**
 * Check if AI server is healthy
 * @returns {Promise<boolean>}
 */
async function checkAIServerHealth() {
  try {
    const response = await axios.get(`${AI_SERVER_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('AI Server Health Check Failed:', error.message);
    return false;
  }
}

/**
 * Get complaint category from AI analysis
 * Determines which department should handle the complaint
 * @param {string} complaintText
 * @param {string} image - Optional base64 image
 * @returns {Promise<Object>} - Category info
 */
async function getCategoryFromAI(complaintText, image = '') {
  try {
    const aiResponse = await processComplaintWithAI(
      complaintText,
      image,
      '',
      new Date().toISOString()
    );

    if (aiResponse.success && aiResponse.data) {
      return {
        success: true,
        category: aiResponse.data.final_department,
        priority: aiResponse.data.final_priority,
        actionPlan: aiResponse.data.action_plan,
        ticketId: aiResponse.data.ticket_id,
        deadline: aiResponse.data.deadline,
        analysis: aiResponse.data.raw_analysis,
        messageHistory: aiResponse.data.message_history
      };
    } else {
      // Fallback category mapping
      const defaultCategory = getDefaultCategory(complaintText);
      return {
        success: false,
        category: defaultCategory,
        priority: 'Medium',
        actionPlan: 'Requires manual review',
        fallback: true
      };
    }
  } catch (error) {
    console.error('Error getting category from AI:', error);
    return {
      success: false,
      category: getDefaultCategory(complaintText),
      fallback: true,
      error: error.message
    };
  }
}

/**
 * Fallback function to determine category based on keywords
 * @param {string} text
 * @returns {string}
 */
function getDefaultCategory(text) {
  const lowerText = text.toLowerCase();
  
  if (
    lowerText.includes('road') || 
    lowerText.includes('pothole') || 
    lowerText.includes('bridge') || 
    lowerText.includes('pavement')
  ) {
    return 'Roads & Bridges PWD';
  } else if (
    lowerText.includes('water') ||
    lowerText.includes('electricity') ||
    lowerText.includes('power') ||
    lowerText.includes('sewer')
  ) {
    return 'Water & Power Board';
  } else if (
    lowerText.includes('traffic') ||
    lowerText.includes('accident') ||
    lowerText.includes('police') ||
    lowerText.includes('hazard')
  ) {
    return 'Traffic & Public Safety';
  } else if (
    lowerText.includes('garbage') ||
    lowerText.includes('waste') ||
    lowerText.includes('park') ||
    lowerText.includes('tree')
  ) {
    return 'Sanitation & Parks';
  }
  
  return 'General';
}

module.exports = {
  processComplaintWithAI,
  checkAIServerHealth,
  getCategoryFromAI,
  getDefaultCategory
};
