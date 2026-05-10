exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  // Simulated pipeline steps
  const pipeline = {
    received: data,
    steps: [
      "upload-handler simulated",
      "storage-router simulated",
      "update-medallion simulated"
    ],
    timestamp: new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Pipeline executed successfully (simulated).",
      pipeline
    })
  };
};
