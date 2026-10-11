CREATE TABLE IF NOT EXISTS arcade_wall (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 160),
  color TEXT NOT NULL CHECK(color IN ('ink','red','blue','green')),
  created_at INTEGER NOT NULL,
  source_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS arcade_wall_date ON arcade_wall(created_at DESC,id);
CREATE INDEX IF NOT EXISTS arcade_wall_rate ON arcade_wall(source_hash,created_at);
