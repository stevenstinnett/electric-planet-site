exports.handler = async (event) => {
  try {
    // Parse incoming JSON from orchestrator
    const body = JSON.parse(event.body);

    // Expecting: { medallionId: "...", storageUrl: "...", caption: "..." }
    const { medallionId, storageUrl, caption } = body;

    // PHASE 1 PLACEHOLDER:
    // Instead of writing to Supabase, we simulate a successful database update.
    const fakeDbResponse = {
      medallionId,
      storageUrl,
      caption,
      updatedAt: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Medallion updated successfully (placeholder).",
        data: fakeDbResponse
      })
    };

  } catch (error) {
    console.error("update-medallion error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "Medallion update failed.",
        details: error.message
      })
    };
  }
};
