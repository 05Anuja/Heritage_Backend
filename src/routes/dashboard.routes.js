
import express from "express";

import {
    getDashboardStats,
    getEnquiryAnalytics,
    getRecentActivities
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.use(authMiddleware, adminOnly);

router.get("/stats", getDashboardStats);

router.get("/enquiry-analytics", getEnquiryAnalytics);

router.get("/recent-activities", getRecentActivities);

export default router;
