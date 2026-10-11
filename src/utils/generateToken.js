import jwt from "jsonwebtoken";

const generateToken = (admin) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        {
            id: admin._id.toString(),
            role: admin.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

export default generateToken;