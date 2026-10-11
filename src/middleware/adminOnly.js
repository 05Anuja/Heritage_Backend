const adminOnly = (req, res, next) => {
    if (!req.admin || req.admin.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }

    next();
};

export default adminOnly;