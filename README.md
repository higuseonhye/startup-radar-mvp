# Startup Radar MVP

AI-native autonomous startup intelligence system for early signal tracking.

## What is implemented

- Dynamic startup feed with Alive Score and "what changed" messaging.
- Startup detail page with:
  - score breakdown
  - signal timeline
  - change history
  - multi-agent debate log
- Portfolio page with AI coaching suggestions.
- Alert stream for major score changes (with optional webhook delivery).
- PWA support (installable web app + cached shell).
- Browser notifications for major score changes after update runs.
- Continuous update loop:
  - ingest signals
  - run multi-agent debate
  - re-evaluate score
  - detect meaningful changes
  - persist memory state

## Architecture (MVP)

```text
Signal ingestion
  -> Scout Agent (event extraction)
  -> Analyst Agent (4-axis scoring)
  -> Skeptic Agent (confidence/risk check)
  -> Synthesizer Agent (final insight)
  -> Alive Score calculation
  -> Change Detector (diff threshold)
  -> Alert Builder (score-change notifications)
  -> Memory Store (state + change log + alerts)
  -> Feed / Detail / Portfolio UI
```

## Score model

- Learning: speed/direction/quality
- Distribution: adoption and spread signals
- Problem: urgency and pain strength
- AI Structure: dependency + defensibility

Alive Score weights:

- Learning: `0.30`
- Distribution: `0.25`
- Problem: `0.20`
- AI Structure: `0.25`

## Local run

```bash
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update cycle command

Run one autonomous re-evaluation cycle:

```bash
npm run update
```

This updates `data/state.json` with:
- new signals
- fresh analyses
- major change entries
- alert entries for important score moves

## API routes

- `GET /api/feed`
- `POST /api/analyze`
- `POST /api/update`
- `GET /api/alerts`
- `GET /api/startup/:id`
- `GET /api/portfolio`
- `POST /api/portfolio`

## Quick walkthrough

1. Open feed and explain that scores are dynamic, not static.
2. Open one startup detail page and show:
   - current Alive Score
   - breakdown across 4 axes
   - debate log + timeline
3. Run update:
   - click `Run Live Update` in UI or run `npm run update`
4. Refresh and show:
   - score changed
   - reason logged in change history
5. Open portfolio page and show AI suggestion change.
6. Show the alert section updating after a score shift.

## Notes

- Data source adapters are currently mocked for MVP speed.
- SQL schema for relational migration is in `db/schema.sql`.
- Set `ALERT_WEBHOOK_URL` to forward alert payloads to Slack/Discord/webhook endpoints.
- Slack and Discord webhooks are auto-formatted for readability.
