import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import creadansial from "./router/credentials.routes.js"
import messageCreadansial from "./router/message.routes.js"
import webhookRoutes from "./router/webhook.routes.js";
import authRoutes from "./router/auth.routes.js";
import inviteRoutes from "./router/invite.routes.js";


import pool from "./config/db.js";

dotenv.config();
const app = express();
app.use(cookieParser());
// app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

const createSuperAdmin = async () => {

  const email = "rehultadvi8143+superA@gmail.com";
  const password = "12345678";

  const existing = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (existing.rows.length === 0) {

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(email,password,role,is_verified)
       VALUES($1,$2,'super_admin',true)`,
      [email, hashed]
    );

    console.log("SUPER ADMIN CREATED ✅");

  } else {
    console.log("SUPER ADMIN already exists ✅");
  }
};

createSuperAdmin();


// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT NOW()");
//   res.json(result.rows);
// });

app.use("/api",creadansial);
app.use("/api",messageCreadansial); 
app.use("/web",webhookRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/invite",inviteRoutes)


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
