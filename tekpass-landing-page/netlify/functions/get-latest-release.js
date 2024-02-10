// netlify/functions/get-latest-release.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_SECRET = process.env.REACT_APP_GITHUB_TOKEN; // Use environment variable
  const apiUrl = `https://api.github.com/repos/${process.env.REACT_APP_OWNER}/${process.env.REACT_APP_REPO}/releases/latest`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${API_SECRET}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      // handle the error
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ msg: error.message }) };
  }
};
