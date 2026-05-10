exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  // Stripe sends raw JSON — we just echo it back for now
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
      message: "stripe-webhook.js received your event!",
      eventType: data.type || "unknown",
      raw: data
    })
  };
};
