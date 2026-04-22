import { UpdateButton } from "@/app/components/update-button";
import { getAlerts, getFeedItems } from "@/lib/memory/history";
import Link from "next/link";

function scoreBadge(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 text-emerald-300";
  if (score >= 65) return "bg-cyan-500/20 text-cyan-300";
  return "bg-amber-500/20 text-amber-300";
}

function confidenceBadge(label: string): string {
  if (label === "high") return "bg-emerald-500/20 text-emerald-300";
  if (label === "medium") return "bg-cyan-500/20 text-cyan-300";
  return "bg-amber-500/20 text-amber-300";
}

export default async function Home() {
  const feed = await getFeedItems();
  const alerts = await getAlerts(5);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-300">
          Discover startups before they are obvious. Scores evolve as signals change.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Install this app from your browser menu for mobile-like quick access.
        </p>
        <div className="mt-4">
          <UpdateButton />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">Recent Alerts</h2>
        <div className="mt-3 space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-zinc-400">No alerts yet. Run an update cycle.</p>
          ) : (
            alerts.map((alert) => (
              <Link
                key={alert.id}
                href={`/startup/${alert.startupId}`}
                className="block rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 hover:border-zinc-600"
              >
                <p className="text-sm font-medium text-zinc-100">{alert.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{alert.startupName}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {feed.map((startup) => (
          <Link
            key={startup.id}
            href={`/startup/${startup.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-600"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">{startup.name}</h2>
                <p className="text-xs text-zinc-400">
                  {startup.sector} · {startup.stage}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreBadge(startup.aliveScore)}`}>
                {startup.aliveScore}
              </span>
            </div>
            <p className="text-sm text-zinc-300">{startup.description}</p>
            <p className="mt-3 text-sm text-zinc-200">{startup.insight}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-200">
                Confidence {Math.round(startup.confidence * 100)}%
              </span>
              <span className={`rounded-full px-2 py-1 ${confidenceBadge(startup.confidenceLabel)}`}>
                Signal Strength {startup.confidenceLabel.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">{startup.caveat}</p>
            <div className="mt-3 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
              {startup.latestChange ? (
                <p>
                  Changed {startup.latestChange.prevScore} → {startup.latestChange.newScore}:{" "}
                  {startup.latestChange.reason}
                </p>
              ) : (
                <p>No major change yet. Watching continuously.</p>
              )}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
