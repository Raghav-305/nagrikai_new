// Generate unique ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `TK-${timestamp}-${randomStr}`;
};

module.exports = { generateTicketId };
