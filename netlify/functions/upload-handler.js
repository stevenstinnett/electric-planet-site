exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "upload-handler.js received your POST request!"
    })
  };
};
