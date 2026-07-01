import Database from 'better-sqlite3';
import path from 'path';

// Define the absolute path for the SQLite database file
const dbPath = path.resolve(process.cwd(), 'database.sqlite');

// Initialize the database
export const db = new Database(dbPath, {
  // verbose: console.log
});

// Enable WAL mode for better performance and concurrency
db.pragma('journal_mode = WAL');

// Define Schema
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      avatarUrl TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      difficulty TEXT,
      thumbnail TEXT,
      price REAL,
      originalPrice REAL,
      rating REAL DEFAULT 0,
      reviewsCount INTEGER DEFAULT 0,
      instructorId TEXT,
      instructorName TEXT,
      studentsCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'approved',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      highlights TEXT, -- JSON string
      chapters TEXT -- JSON string
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      progressPercentage REAL DEFAULT 0,
      completedModuleIds TEXT, -- JSON string
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      isTrial BOOLEAN DEFAULT 0,
      trialStartDate DATETIME,
      lastSeenModuleId TEXT,
      lastSeenPositionSeconds REAL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT DEFAULT 'created',
      paymentGateway TEXT,
      invoiceId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS history_astrology (
      id TEXT PRIMARY KEY,
      userId TEXT,
      data TEXT NOT NULL, -- JSON string
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS history_numerology (
      id TEXT PRIMARY KEY,
      userId TEXT,
      data TEXT NOT NULL, -- JSON string
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// Call initDb to ensure tables exist
initDb();

export default db;
