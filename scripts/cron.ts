import { watcherAgent } from "../lib/agents/watcherAgent";

async function run() {
  const { updates, alerts } = await watcherAgent();
  console.log("Radar update cycle completed.");
  for (const update of updates) {
    console.log(
      `${update.name}: ${update.prev} -> ${update.next}${update.changed ? " (major change logged)" : ""}`,
    );
  }
  console.log(`Alerts created: ${alerts.length}`);
}

run().catch((error) => {
  console.error("Update cycle failed:", error);
  process.exit(1);
});
