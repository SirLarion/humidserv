pub const TABLE_QUERY: &str = "
  CREATE TABLE IF NOT EXISTS temperature (id INTEGER NOT NULL, value REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS humidity (id INTEGER NOT NULL, value REAL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);
";

pub const TEMPERATURE_INSERT_QUERY: &str = "INSERT INTO temperature (id, value) VALUES (:id, :value);";
pub const HUMIDITY_INSERT_QUERY: &str = "INSERT INTO humidity (id, value) VALUES (:id, :value);";

pub const TEMPERATURE_QUERY: &str = "SELECT value, timestamp FROM temperature ORDER BY timestamp DESC;";
pub const HUMIDITY_QUERY: &str = "SELECT value, timestamp FROM humidity ORDER BY timestamp DESC;";
