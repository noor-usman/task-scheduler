import sqlite3 from 'sqlite3';

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:');

// Create tasks and logs tables
db.serialize(() => {
  db.run("CREATE TABLE tasks (id TEXT PRIMARY KEY, name TEXT, type TEXT, schedule TEXT, status TEXT, nextExecutionTime INTEGER)");
  db.run("CREATE TABLE logs (id INTEGER PRIMARY KEY AUTOINCREMENT, taskId TEXT, executionTime INTEGER, status TEXT)");
});

export default db;
