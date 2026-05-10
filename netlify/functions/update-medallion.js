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

  // Simulated medallion update
  const updatedMedallion = {
    medallionId: data.medallionId || "unknown",
    updatedFields: data.fields || {},
    timestamp: new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Medallion updated successfully (simulated).",
      medallion: updatedMedallion
    })
  };
};
