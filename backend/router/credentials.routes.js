import express from "express";
import { saveCredentialsController } from "../controllers/credentials.controller.js";

const router = express.Router();

// Save Credentials
router.post("/credentials", saveCredentialsController);

export default router;
