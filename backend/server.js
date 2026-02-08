import express from "express";
import cors from "cors"
import creadansial from "./router/credentials.routes.js"
import messageCreadansial from "./router/message.routes.js"
import webhookRoutes from "./router/webhook.routes.js";
import authRoutes from "./router/auth.routes.js";

import pool from "./config/db.js";

const app = express();

// app.use(cors()); 
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT NOW()");
//   res.json(result.rows);
// });

app.use("/api",creadansial);
app.use("/api",messageCreadansial); 
app.use("/web",webhookRoutes);
app.use("/api/auth",authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
