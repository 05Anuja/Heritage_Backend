
import "dotenv/config";
import express from "express";
import cors from "cors";

import connectCloudinary from "./config/cloudinary.js";
import productRoutes from "./routes/product.route.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Connect Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
    process.env.PUBLIC_FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an Origin header, such as server-to-server requests
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
    })
);

// Product routes
app.use("/api/products", productRoutes);

// Enquiry routes
app.use("/api/enquiries", enquiryRoutes);

// Admin authentication routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Heritage Backend is running",
    });
});

export default app;
