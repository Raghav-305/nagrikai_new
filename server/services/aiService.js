const axios = require('axios');

const analyzeComplaint = async (title, description) => {
  try {
    const response = await axios.post(
      `${process.env.FASTAPI_URL}/analyze`,
      {
        title,
        description,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error calling FastAPI:', error);
    return {
      category: 'unknown',
      sentiment: 'neutral',
    };
  }
};

module.exports = {
  analyzeComplaint,
};
