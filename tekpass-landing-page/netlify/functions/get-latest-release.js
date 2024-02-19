// const fetch = require("node-fetch");

const fetch = (await import('node-fetch')).default;

exports.handler = async (event, context) => {
  const API_SECRET = process.env.REACT_APP_GITHUB_TOKEN; // Use environment variable for security
  const apiUrl = `https://api.github.com/repos/${process.env.REACT_APP_OWNER}/${process.env.REACT_APP_REPO}/releases/latest`;

  console.log("API request initiated:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${API_SECRET}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    console.log("API response status:", response.status);
    // Logging headers or the body can expose sensitive information, so be cautious in production

    if (!response.ok) {
      // Improved error handling
      console.error("API response error:", response.statusText);
      return { statusCode: response.status, body: JSON.stringify({ message: "Error fetching latest release" }) };
    }

    const data = await response.json();
    // Truncation of the response body for logging purposes should be handled carefully
    // Example of logging truncated data safely is omitted for brevity and security

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Request failed:", error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
