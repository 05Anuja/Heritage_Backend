import express from "express";
import { createEnquiry, getEnquiry } from "../controllers/enquiry.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// Public Route
router.post('/', createEnquiry);

// Admin-Only Route
router.get('/', authMiddleware, adminOnly, getEnquiry);

export default router;