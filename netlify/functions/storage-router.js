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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "storage-router.js received your data!",
      received: data
    })
  };
};
