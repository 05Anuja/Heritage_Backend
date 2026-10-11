import express from "express";
import { adminLogin, adminLogout } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin)
router.post("/logout", authMiddleware, adminLogout)

export default router;