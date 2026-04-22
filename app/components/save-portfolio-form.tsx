"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  startupId: string;
};

export function SavePortfolioForm({ startupId }: Props) {
  const [weight, setWeight] = useState(15);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");

    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId, weight, note }),
    });

    if (!res.ok) {
      setStatus("Failed to save.");
      return;
    }

    setStatus("Saved to portfolio.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-sm font-medium text-zinc-100">Add to portfolio</p>
      <label className="block text-sm text-zinc-300">
        Weight (%)
        <input
          type="number"
          min={1}
          max={100}
          value={weight}
          onChange={(event) => setWeight(Number(event.target.value))}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
        />
      </label>
      <label className="block text-sm text-zinc-300">
        Note
        <input
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          placeholder="Why this position?"
        />
      </label>
      <button className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-white" type="submit">
        Save
      </button>
      {status ? <p className="text-xs text-zinc-400">{status}</p> : null}
    </form>
  );
}
