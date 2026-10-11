import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "../src/config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import productRoutes from '../src/routes/product.route.js'
import enquiryRoutes from '../src/routes/enquiry.route.js'
import authRoutes from '../src/routes/auth.routes.js'

const app = express();

connectDB();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

// Product Routes
app.use('/api/products', productRoutes)

// Enquiry Routes
app.use('/api/enquiries', enquiryRoutes)

// Admin Routes
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
    res.json({ message: "Welcome to HRMS API" });
});

export default app;