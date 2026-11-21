
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectCloudinary from "./config/cloudinary.js";
import productRoutes from "./routes/product.route.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from './routes/dashboard.routes.js'

const app = express();

// Connect Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


// Product routes
app.use("/api/products", productRoutes);

// Enquiry routes
app.use("/api/enquiries", enquiryRoutes);

// Admin authentication routes
app.use("/api/auth", authRoutes);

// Dashboard routes
app.use("/api/dashboard", dashboardRoutes)

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Heritage Backend is running",
    });
});

export default app;
