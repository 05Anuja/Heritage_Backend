import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import connectDB from "../src/config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import productRoute from '../src/routes/productRoute.js'

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
app.use('/api/products', productRoute)

app.get("/api/health", (req, res) => {
    res.json({ message: "Welcome to HRMS API" });
});

export default app;