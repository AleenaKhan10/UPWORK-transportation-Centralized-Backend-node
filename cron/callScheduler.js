const cron = require("node-cron");
const { makeCallsToMultipleDrivers } = require("../controllers/callController");

// Run every day at 7:00 AM
cron.schedule("0 7 * * *", async () => {
  console.log("🔔 Running driver call job at 7:00 AM");
  await makeCallsToMultipleDrivers();
});
