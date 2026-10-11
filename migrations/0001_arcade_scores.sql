CREATE TABLE IF NOT EXISTS arcade_scores (
  id TEXT PRIMARY KEY,
  game TEXT NOT NULL CHECK (game IN ('hat-rack-rhythm','ur-in-trouble')),
  initials TEXT NOT NULL CHECK (length(initials) = 3),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10000000),
  created_at INTEGER NOT NULL,
  source_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS arcade_game_rank ON arcade_scores(game,score DESC,created_at,id);
CREATE INDEX IF NOT EXISTS arcade_submission_rate ON arcade_scores(source_hash,created_at);
