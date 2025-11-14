const { Pool } = require("pg");
require("dotenv").config(); // Load biến môi trường từ .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const createJobTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job (
        id SERIAL PRIMARY KEY,
        job_title TEXT NOT NULL,
        location TEXT,
        department TEXT,
        reports_to TEXT,
        employment_type TEXT,
        about_us TEXT,
        job_description TEXT,
        key_responsibilities TEXT,
        qualifications TEXT,
        preferred_qualifications TEXT,
        benefits TEXT,
        application_instructions TEXT,
        equal_opportunity_statement TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Job table created or already exists.");
  } catch (err) {
    console.error("❌ Failed to create table:", err);
  } finally {
    await pool.end();
  }
};

createJobTable();
