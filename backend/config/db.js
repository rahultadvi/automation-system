import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
      }
);

// ✅ Safe Connection Test
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
    client.release(); // IMPORTANT
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message);
  }
})();

export default pool;



// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pkg;


// const isProduction = process.env.NODE_ENV === "production";

// const pool = new Pool(
//   isProduction
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false }
//       }
//     : {
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT
//       }
// );

// // Test Database Connection
// pool.connect()
//   .then(() => {
//     console.log("✅ PostgreSQL Connected Successfully");
//   })
//   .catch((err) => {
//     console.error("❌ Database Connection Error:", err.message);
//   });

// export default pool;
