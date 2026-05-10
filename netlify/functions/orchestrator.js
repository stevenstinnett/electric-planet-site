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

  const baseUrl = process.env.URL || "https://electricplanet.energy";

  const uploadResponse = await fetch(`${baseUrl}/.netlify/functions/upload-handler`, {
    method: "POST",
    body: JSON.stringify({ test: "upload step", original: data })
  }).then(res => res.json());

  const storageResponse = await fetch(`${baseUrl}/.netlify/functions/storage-router`, {
    method: "POST",
    body: JSON.stringify({ test: "storage step", original: data })
  }).then(res => res.json());

  const medallionResponse = await fetch(`${baseUrl}/.netlify/functions/update-medallion`, {
    method: "POST",
    body: JSON.stringify({
      medallionId: data.medallionId || "unknown",
      fields: { test: "update step" }
    })
  }).then(res => res.json());

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Pipeline executed with real internal calls.",
      pipeline: {
        upload: uploadResponse,
        storage: storageResponse,
        medallion: medallionResponse
      }
    })
  };
};
