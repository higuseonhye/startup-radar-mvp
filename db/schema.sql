CREATE TABLE startups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE signals (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  source TEXT NOT NULL,
  content TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE analyses (
  id SERIAL PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  alive_score INT NOT NULL,
  learning INT NOT NULL,
  distribution INT NOT NULL,
  problem INT NOT NULL,
  ai_structure INT NOT NULL,
  insight TEXT NOT NULL,
  debate_log JSONB NOT NULL,
  confidence FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE changes (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  prev_score INT NOT NULL,
  new_score INT NOT NULL,
  reason TEXT NOT NULL,
  evidence_json JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE portfolio_items (
  id SERIAL PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  weight INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  startup_id TEXT NOT NULL REFERENCES startups(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
