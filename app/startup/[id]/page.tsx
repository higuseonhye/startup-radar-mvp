import { SavePortfolioForm } from "@/app/components/save-portfolio-form";
import { getStartupById } from "@/lib/memory/history";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function StartupDetailPage({ params }: Params) {
  const { id } = await params;
  const startup = await getStartupById(id);
  if (!startup) notFound();

  const latest = startup.analyses[startup.analyses.length - 1];
  const signals = [...startup.signals].slice(-8).reverse();
  const changes = [...startup.changes].slice(-6).reverse();

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-5">
        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-2xl font-semibold">{startup.name}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {startup.sector} · {startup.stage}
          </p>
          <p className="mt-3 text-zinc-200">{startup.description}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard label="Alive Score" value={String(latest?.aliveScore ?? 0)} />
            <StatCard label="Confidence" value={`${Math.round((latest?.confidence ?? 0) * 100)}%`} />
          </div>
          <p className="mt-4 text-sm text-zinc-300">{latest?.insight}</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold">Score Breakdown</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Breakdown label="Learning" value={latest?.dimensions.learning ?? 0} />
            <Breakdown label="Distribution" value={latest?.dimensions.distribution ?? 0} />
            <Breakdown label="Problem Strength" value={latest?.dimensions.problem ?? 0} />
            <Breakdown label="AI Structure" value={latest?.dimensions.aiStructure ?? 0} />
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold">Change History</h3>
          <div className="mt-3 space-y-3">
            {changes.length === 0 ? (
              <p className="text-sm text-zinc-400">No major score changes yet.</p>
            ) : (
              changes.map((change) => (
                <div key={change.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <p className="text-sm font-medium text-zinc-200">
                    {change.prevScore} → {change.newScore}
                  </p>
                  <p className="text-sm text-zinc-300">{change.reason}</p>
                  <p className="mt-1 text-xs text-zinc-500">{change.evidence}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold">Signal Timeline</h3>
          <div className="mt-3 space-y-2">
            {signals.map((signal) => (
              <div key={signal.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <p className="text-xs text-zinc-400">
                  {signal.source} · {signal.signalType} · {signal.isVerified ? "verified" : "unverified"}
                </p>
                <p className="mt-1 text-sm text-zinc-200">{signal.content}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <aside className="space-y-5">
        <SavePortfolioForm startupId={startup.id} />

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-sm font-semibold text-zinc-100">Debate Log</h3>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>
              <strong className="text-zinc-100">Scout:</strong> {latest?.debateLog.scout}
            </p>
            <p>
              <strong className="text-zinc-100">Analyst:</strong> {latest?.debateLog.analyst}
            </p>
            <p>
              <strong className="text-zinc-100">Skeptic:</strong> {latest?.debateLog.skeptic}
            </p>
            <p>
              <strong className="text-zinc-100">Synthesizer:</strong> {latest?.debateLog.synthesizer}
            </p>
          </div>
        </article>
      </aside>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function Breakdown({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
