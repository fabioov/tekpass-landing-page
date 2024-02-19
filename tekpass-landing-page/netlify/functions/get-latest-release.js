// 
const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const response = await axios.get('https://api.github.com/repos/fabioov/TekPass-Releases/releases/latest', {
      headers: {
        'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Request failed:', error);
    return {
      statusCode: error.response.status || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
