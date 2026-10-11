import generateToken from "../utils/generateToken.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required!"
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required!"
            })
        }

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            });
        }

        // compare the password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }
        const token = generateToken(admin);

        return res.status(200).json({
            success: true,
            message: "Admin Login Successfully",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            }
        })
    } catch (err) {
        console.log("Admin Login Error", err);
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error: err.message
        })
    }
}

export const adminLogout = async (req, res) => {
    try {
        console.log("Logout Successfully!")
        return res.status(200).json({
            success: true,
            message: "Admin Logout Successfully",
        })
    } catch (err) {
        console.log("Admin Logout Error", err);
        return res.status(500).json({
            success: false,
            message: "Failed to Logout",
            error: err.message,
        })
    }
} 