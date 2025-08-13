const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./traffic.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS traffic (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      level INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database initialized");
});

db.close();
