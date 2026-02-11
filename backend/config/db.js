import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;




const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL,
      ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false  
});

// Test Database Connection
pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });

export default pool;
