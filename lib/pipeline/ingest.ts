import { SignalRecord, StartupRecord } from "@/lib/types";

type SourceCandidate = {
  source: "Product Hunt" | "GitHub" | "Hacker News";
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  isVerified: boolean;
};

const STOPWORDS = new Set([
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "your",
  "their",
  "agent",
  "startup",
  "native",
  "autonomous",
  "assistant",
  "platform",
  "system",
]);

function classifySignalType(text: string): SignalRecord["signalType"] {
  const lower = text.toLowerCase();
  if (lower.includes("founder left") || lower.includes("departure") || lower.includes("team")) return "team";
  if (lower.includes("github") || lower.includes("agent") || lower.includes("model")) return "ai";
  if (lower.includes("launch") || lower.includes("product hunt") || lower.includes("show hn")) return "distribution";
  if (lower.includes("customer") || lower.includes("problem") || lower.includes("pain")) return "problem";
  if (lower.includes("release") || lower.includes("build") || lower.includes("ship")) return "product";
  return "general";
}

function buildKeywords(startup: StartupRecord): string[] {
  const raw = `${startup.name} ${startup.sector} ${startup.description}`
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 4 && !STOPWORDS.has(token));

  return Array.from(new Set([startup.name.toLowerCase(), ...raw])).slice(0, 10);
}

function textMatchScore(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((acc, keyword) => acc + (lower.includes(keyword) ? 1 : 0), 0);
}

function toSignalRecord(startupId: string, candidate: SourceCandidate, idx: number): SignalRecord {
  const fullText = `${candidate.title}. ${candidate.content}`;
  return {
    id: `${startupId}-${candidate.source.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}-${idx}`,
    source: candidate.source,
    content: fullText,
    url: candidate.url,
    signalType: classifySignalType(fullText),
    isVerified: candidate.isVerified,
    createdAt: candidate.publishedAt,
  };
}

async function safeFetch(url: string, headers?: HeadersInit): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "startup-radar-mvp",
        ...headers,
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function fetchGitHubCandidates(): Promise<SourceCandidate[]> {
  const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);
  const raw = await safeFetch(
    `https://api.github.com/search/repositories?q=created:%3E${date}&sort=stars&order=desc&per_page=25`,
  );
  if (!raw) return [];

  const parsed = JSON.parse(raw) as {
    items?: Array<{ full_name: string; description: string | null; html_url: string; updated_at: string }>;
  };

  return (parsed.items ?? []).map((item) => ({
    source: "GitHub",
    title: item.full_name,
    content: item.description ?? "Repository activity rising.",
    url: item.html_url,
    publishedAt: item.updated_at ?? new Date().toISOString(),
    isVerified: true,
  }));
}

async function fetchHackerNewsCandidates(): Promise<SourceCandidate[]> {
  const idsRaw = await safeFetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!idsRaw) return [];
  const ids = (JSON.parse(idsRaw) as number[]).slice(0, 20);

  const items = await Promise.all(
    ids.map(async (id) => {
      const itemRaw = await safeFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      if (!itemRaw) return null;
      const item = JSON.parse(itemRaw) as { title?: string; url?: string; time?: number; text?: string };
      if (!item.title) return null;
      return {
        source: "Hacker News" as const,
        title: item.title,
        content: item.text?.replace(/<[^>]*>/g, " ").slice(0, 220) ?? "HN community discussion signal.",
        url: item.url ?? `https://news.ycombinator.com/item?id=${id}`,
        publishedAt: item.time ? new Date(item.time * 1000).toISOString() : new Date().toISOString(),
        isVerified: true,
      };
    }),
  );

  return items.flatMap((item) => (item ? [item] : []));
}

async function fetchProductHuntCandidates(): Promise<SourceCandidate[]> {
  const token = process.env.PRODUCT_HUNT_TOKEN;
  if (!token) return [];

  const query = {
    query: `query {
      posts(first: 20) {
        edges {
          node {
            id
            name
            tagline
            url
            createdAt
          }
        }
      }
    }`,
  };

  try {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(query),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const parsed = (await response.json()) as {
      data?: {
        posts?: {
          edges?: Array<{
            node?: { name?: string; tagline?: string; url?: string; createdAt?: string };
          }>;
        };
      };
    };
    const edges = parsed.data?.posts?.edges ?? [];
    return edges
      .map((edge) => edge.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node?.name && node?.url))
      .map((node) => ({
        source: "Product Hunt" as const,
        title: node.name ?? "Product launch",
        content: node.tagline ?? "Product Hunt launch signal.",
        url: node.url ?? "https://www.producthunt.com",
        publishedAt: node.createdAt ?? new Date().toISOString(),
        isVerified: true,
      }));
  } catch {
    return [];
  }
}

function injectConvergenceSignal(startup: StartupRecord, signals: SignalRecord[]): SignalRecord[] {
  const uniqueSources = Array.from(new Set(signals.map((signal) => signal.source)));
  if (uniqueSources.length < 2) return signals;

  return [
    ...signals,
    {
      id: `${startup.id}-convergence-${Date.now()}`,
      source: "Radar Engine",
      content: `Multi-source convergence detected across ${uniqueSources.join(", ")}.`,
      signalType: "distribution",
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function ingestSignalsForStartups(startups: StartupRecord[]) {
  const [github, hn, productHunt] = await Promise.all([
    fetchGitHubCandidates(),
    fetchHackerNewsCandidates(),
    fetchProductHuntCandidates(),
  ]);

  const pool = [...github, ...hn, ...productHunt];
  const byStartup: Record<string, SignalRecord[]> = {};

  for (const startup of startups) {
    const keywords = buildKeywords(startup);
    const matched = pool
      .map((candidate) => ({
        candidate,
        score: textMatchScore(`${candidate.title} ${candidate.content}`, keywords),
      }))
      .filter((entry) => entry.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry, idx) => toSignalRecord(startup.id, entry.candidate, idx));

    byStartup[startup.id] = injectConvergenceSignal(startup, matched);
  }

  return byStartup;
}
