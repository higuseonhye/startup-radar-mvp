"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertRecord } from "@/lib/types";

export function UpdateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationState, setNotificationState] = useState<"idle" | "enabled" | "blocked">("idle");

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotificationState("blocked");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationState(permission === "granted" ? "enabled" : "blocked");
  }

  function fireLocalNotifications(alerts: AlertRecord[]) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    alerts.slice(0, 3).forEach((alert) => {
      new Notification(alert.title, { body: alert.message });
    });
  }

  async function runUpdate() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update", { method: "POST" });
      const data = (await res.json()) as { updates?: Array<{ changed: boolean }>; alerts?: AlertRecord[] };
      const changed = data.updates?.filter((item) => item.changed).length ?? 0;
      const alerts = data.alerts ?? [];
      fireLocalNotifications(alerts);
      setMessage(`Update finished. ${changed} startup(s) had major score changes.`);
      router.refresh();
    } catch {
      setMessage("Update failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={runUpdate}
        disabled={loading}
        className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating..." : "Run Live Update"}
      </button>
      <button
        type="button"
        onClick={enableNotifications}
        className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-100 hover:border-zinc-500"
      >
        {notificationState === "enabled"
          ? "Notifications Enabled"
          : notificationState === "blocked"
            ? "Notifications Blocked"
            : "Enable Browser Alerts"}
      </button>
      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </div>
  );
}
