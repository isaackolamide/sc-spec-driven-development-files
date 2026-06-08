export function migrate(db) {
    // Ensure foreign keys are enabled in SQLite
    db.pragma('foreign_keys = ON');
    db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      temperature REAL NOT NULL,
      system_prompt_length INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ailments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high'))
    );

    CREATE TABLE IF NOT EXISTS therapies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      cost_in_tokens INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      ailment_id TEXT NOT NULL,
      therapy_id TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'scheduled', 'completed', 'cancelled')),
      FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE CASCADE,
      FOREIGN KEY (ailment_id) REFERENCES ailments (id) ON DELETE CASCADE,
      FOREIGN KEY (therapy_id) REFERENCES therapies (id) ON DELETE CASCADE
    );
  `);
}
