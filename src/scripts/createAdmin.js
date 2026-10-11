import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not configured!")
        }
        const { Admin_Name, Admin_Email, Admin_Password } = process.env;
        if (!Admin_Name || !Admin_Email || !Admin_Password) {
            throw new Error("Admin credentials are not provided")
        }
        if (Admin_Password.length < 10) {
            throw new Error("Password must be at least 10 characters long")
        }
        await mongoose.connect(process.env.MONGO_URI);
        const email = Admin_Email.trim().toLowerCase();
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("Admin already exists!")
            return;
        }
        const hashedPassword = await bcrypt.hash(Admin_Password, 10);
        const admin = await Admin.create({
            name: Admin_Name,
            email,
            password: hashedPassword,
            role: "admin"
        })
        console.log("Admin created successfully", admin);
    } catch (err) {
        console.log("Admin creation failed", err.message);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

createAdmin();