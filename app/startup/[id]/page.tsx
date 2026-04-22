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
  const signals = [...startup.signals].slice(-12).reverse();
  const changes = [...startup.changes].slice(-6).reverse();
  const verifiedSignals = signals.filter((signal) => signal.isVerified);
  const unverifiedSignals = signals.filter((signal) => !signal.isVerified);
  const sourceStats = Array.from(
    signals.reduce<Map<string, number>>((map, signal) => {
      map.set(signal.source, (map.get(signal.source) ?? 0) + 1);
      return map;
    }, new Map()),
  ).sort((a, b) => b[1] - a[1]);

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
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2 py-1 ${signalStrengthStyle(latest?.confidenceBreakdown?.signalStrength)}`}>
              Signal Strength {(latest?.confidenceBreakdown?.signalStrength ?? "low").toUpperCase()}
            </span>
            <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-200">
              Sources {latest?.confidenceBreakdown?.sourceDiversity ?? sourceStats.length}
            </span>
            <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-200">
              Verified Ratio {Math.round((latest?.confidenceBreakdown?.verifiedRatio ?? 0) * 100)}%
            </span>
          </div>
          <p className="mt-4 text-sm text-zinc-300">{latest?.insight}</p>
          <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            <p className="font-medium">Uncertainty Note</p>
            <ul className="mt-1 space-y-1 text-xs text-amber-100/90">
              {(latest?.caveats ?? ["This assessment may change as additional signals arrive."]).map((caveat) => (
                <li key={caveat}>- {caveat}</li>
              ))}
            </ul>
          </div>
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
          <h3 className="text-lg font-semibold">Source Transparency</h3>
          <div className="mt-3 space-y-2">
            {sourceStats.map(([source, count]) => (
              <div key={source} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <p className="text-sm text-zinc-200">{source}</p>
                <p className="text-xs text-zinc-400">{count} signal(s)</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold">Verified vs Unverified</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-sm font-medium text-emerald-200">Verified ({verifiedSignals.length})</p>
              <div className="mt-2 space-y-2">
                {verifiedSignals.length === 0 ? (
                  <p className="text-xs text-emerald-100/80">No verified signals in the latest window.</p>
                ) : (
                  verifiedSignals.slice(0, 5).map((signal) => (
                    <SignalLine key={signal.id} source={signal.source} content={signal.content} createdAt={signal.createdAt} />
                  ))
                )}
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm font-medium text-amber-200">Unverified ({unverifiedSignals.length})</p>
              <div className="mt-2 space-y-2">
                {unverifiedSignals.length === 0 ? (
                  <p className="text-xs text-amber-100/80">No unverified signals in the latest window.</p>
                ) : (
                  unverifiedSignals.slice(0, 5).map((signal) => (
                    <SignalLine key={signal.id} source={signal.source} content={signal.content} createdAt={signal.createdAt} />
                  ))
                )}
              </div>
            </div>
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
          <h3 className="text-lg font-semibold">What We Thought vs What Happened</h3>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>
              Initial view ({formatDate(startup.analyses[0]?.createdAt)}): {startup.analyses[0]?.insight}
            </p>
            <p>
              Latest view ({formatDate(latest?.createdAt)}): {latest?.insight}
            </p>
            <p className="text-zinc-400">
              Score path: {startup.analyses[0]?.aliveScore ?? 0} → {latest?.aliveScore ?? 0}
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <h3 className="text-lg font-semibold">Signal Timeline</h3>
          <div className="mt-3 space-y-2">
            {signals.map((signal) => (
              <div key={signal.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <p className="text-xs text-zinc-400">
                  {signal.source} · {signal.signalType} · {signal.isVerified ? "verified" : "unverified"} ·{" "}
                  {formatDate(signal.createdAt)}
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
          <div className="mt-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
            <p className="font-medium">Counterpoint (Skeptic)</p>
            <p className="mt-1 text-xs">{latest?.debateLog.skeptic}</p>
          </div>
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

function SignalLine({ source, content, createdAt }: { source: string; content: string; createdAt: string }) {
  return (
    <div className="rounded-md border border-zinc-700/70 bg-zinc-900/40 p-2">
      <p className="text-xs text-zinc-300">
        {source} · {formatDate(createdAt)}
      </p>
      <p className="text-xs text-zinc-200">{content}</p>
    </div>
  );
}

function signalStrengthStyle(strength: "low" | "medium" | "high" | undefined): string {
  if (strength === "high") return "bg-emerald-500/20 text-emerald-300";
  if (strength === "medium") return "bg-cyan-500/20 text-cyan-300";
  return "bg-amber-500/20 text-amber-300";
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}
