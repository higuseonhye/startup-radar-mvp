import { AlertRecord, ChangeRecord, StartupRecord } from "@/lib/types";

type AlertInput = {
  startup: StartupRecord;
  change: ChangeRecord;
};

function severityFromDiff(prev: number, next: number): "low" | "medium" | "high" {
  const diff = Math.abs(next - prev);
  if (diff >= 10) return "high";
  if (diff >= 6) return "medium";
  return "low";
}

export function buildAlert({ startup, change }: AlertInput): AlertRecord {
  const down = change.newScore < change.prevScore;
  const verb = down ? "dropped" : "increased";
  const severity = severityFromDiff(change.prevScore, change.newScore);

  return {
    id: `alert-${startup.id}-${Date.now()}`,
    startupId: startup.id,
    startupName: startup.name,
    title: `Alive Score ${verb}: ${change.prevScore} -> ${change.newScore}`,
    message: `${change.reason}. Evidence: ${change.evidence}`,
    severity,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export async function sendWebhookAlert(alert: AlertRecord) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;

  const isDiscord = url.includes("discord.com/api/webhooks");
  const isSlack = url.includes("hooks.slack.com/services");

  let payload: unknown = alert;
  if (isDiscord) {
    payload = {
      content: `**${alert.title}**\n${alert.startupName}\n${alert.message}\nSeverity: ${alert.severity.toUpperCase()}`,
    };
  } else if (isSlack) {
    payload = {
      text: `${alert.title} (${alert.startupName})`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: alert.title },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Startup:* ${alert.startupName}\n*Severity:* ${alert.severity}\n*Detail:* ${alert.message}`,
          },
        },
      ],
    };
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
