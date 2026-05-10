exports.handler = async (event) => {
  try {
    // Stripe sends raw body, but for Phase 1 placeholder we parse JSON normally
    const body = JSON.parse(event.body);

    console.log("Received Stripe webhook event (placeholder):", body);

    // PHASE 1 PLACEHOLDER:
    // We pretend the payment was successful and return a confirmation.
    const fakePaymentConfirmation = {
      paymentStatus: "succeeded",
      amount: body.amount || "unknown",
      medallionId: body.medallionId || "unknown",
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Stripe webhook processed successfully (placeholder).",
        data: fakePaymentConfirmation
      })
    };

  } catch (error) {
    console.error("stripe-webhook error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "Stripe webhook failed.",
        details: error.message
      })
    };
  }
};
