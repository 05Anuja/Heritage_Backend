import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required",
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured",
            });
        }

        // Verify token signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access is required",
            });
        }

        // Verify that the admin account still exists
        const admin = await Admin.findById(decoded.id).select("_id name email role");

        if (!admin || admin.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Admin account not found or access denied",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please log in again.",
            });
        }

        console.error("Authentication Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
};

export default authMiddleware;