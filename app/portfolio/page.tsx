import { getAlerts, getPortfolio } from "@/lib/memory/history";
import Link from "next/link";

export default async function PortfolioPage() {
  const items = await getPortfolio();
  const alerts = await getAlerts(5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-100">Portfolio Coach</h2>
      <p className="text-sm text-zinc-300">
        AI suggestions are updated whenever startup signals shift meaningfully.
      </p>
      <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <h3 className="text-sm font-semibold text-zinc-100">Portfolio Alerts</h3>
        <div className="mt-2 space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-zinc-400">No recent alerts.</p>
          ) : (
            alerts.map((alert) => (
              <p key={alert.id} className="text-sm text-zinc-300">
                <span className="font-medium text-zinc-100">{alert.startupName}:</span> {alert.title}
              </p>
            ))
          )}
        </div>
      </section>
      <section className="grid gap-3">
        {items.length === 0 ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
            No startups saved yet. Add one from the feed.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.startupId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link href={`/startup/${item.startupId}`} className="text-lg font-semibold text-zinc-100 hover:text-cyan-300">
                    {item.startupName}
                  </Link>
                  <p className="text-sm text-zinc-400">Position: {item.weight}%</p>
                </div>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-300">
                  Alive Score {item.aliveScore}
                </span>
              </div>
              {item.note ? <p className="mt-2 text-sm text-zinc-300">Note: {item.note}</p> : null}
              <p className="mt-3 text-sm text-zinc-200">Suggested action: {item.action}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
