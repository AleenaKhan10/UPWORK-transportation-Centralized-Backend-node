export function extractInsights(transcript) {
  const lowerTranscript = transcript.toLowerCase();

  const getMatch = (regex) => {
    const match = transcript.match(regex);
    return match ? match[1].trim() : null;
  };

  return {
    currentLocation: getMatch(/(?:near|around|close to)\s([A-Z][a-zA-Z\s]+)/i),
    milesRemaining: getMatch(/about\s(\d+)\s*miles/i),
    eta: getMatch(
      /(?:eta.*?|arrive.*?at|pickup.*?at)\s*([0-9]{1,2}[:\s]?[0-9]{2}\s*(?:am|pm)?)/i
    ),
    onTimeStatus: /delay|late|behind schedule/i.test(lowerTranscript)
      ? "Delayed"
      : /on time|right on schedule/i.test(lowerTranscript)
      ? "On Time"
      : "Unknown",
    delayReason:
      getMatch(/delay(?:ed)? (?:due to|because of)\s+(.*?)(?:\.|,|$)/i) ||
      getMatch(
        /\b(heavy traffic|road block|weather|accident|construction|police activity|detour|mechanical issue|closed road|jammed traffic)\b/i
      ),

    driverMood: getMatch(
      /(?:i'?m|i am|feeling)\s+(good|okay|fine|tired|bad|sick)/i
    ),
    preferredCallbackTime: getMatch(
      /call (?:me)? back (?:at|around)?\s*(\d{1,2}[:\s]?\d{2}\s*(am|pm)?)/i
    ),
    wantsTextInstead: /text you instead|can you text/i.test(lowerTranscript),
    issueReported: getMatch(/issue with (.*?)\.?/i),
    weatherCondition: getMatch(/weather is (.*?)\.?/i),
    roadCondition: getMatch(/road(?:s)? are (.*?)\.?/i),
  };
}
