const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Create a reusable connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Number of connections allowed simultaneously
  queueLimit: 0,       // Unlimited queueing
});

// Test the database connection immediately on app start
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // Release connection back to pool
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    // Optionally exit process here if DB connection is critical:
    // process.exit(1);
  }
})();

module.exports = pool;
