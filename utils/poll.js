async function pollRingOutStatus(
  platform,
  callId,
  maxAttempts = 10,
  delayMs = 2000
) {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const res = await platform.get(
        `/restapi/v1.0/account/~/extension/~/ring-out/${callId}`
      );
      const data = await res.json();

      const { callStatus, calleeStatus, callerStatus } = data.status;

      console.log(`🔄 Poll attempt ${attempt}:`, data.status);

      if (
        ["Success", "NoAnswer", "Rejected", "Busy", "Failed"].includes(
          callStatus
        )
      ) {
        return {
          callStatus,
          callerStatus,
          calleeStatus,
          attempts: attempt,
        };
      }
    } catch (err) {
      console.error("❌ Polling error:", err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { callStatus: "Timeout", attempts: attempt };
}

module.exports = { pollRingOutStatus };
