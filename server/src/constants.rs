pub const TABLE_QUERY: &str = "
  CREATE TABLE IF NOT EXISTS temperature (id INTEGER NOT NULL, value REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS humidity (id INTEGER NOT NULL, value REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
";
