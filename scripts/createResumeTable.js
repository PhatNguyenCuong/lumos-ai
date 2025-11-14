const { Pool } = require("pg");
require("dotenv").config(); // Load biến môi trường từ .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const createResumeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resume (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        summary TEXT,
        education TEXT,              -- Array of string
        experience TEXT,             -- Array of string
        certifications TEXT,         -- Array of string
        skills TEXT,                 -- Array of string
        projects TEXT,               -- JSON array of objects (project list)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Resume table created or already exists.");
  } catch (err) {
    console.error("❌ Failed to create resume table:", err);
  } finally {
    await pool.end();
  }
};

createResumeTable();
