
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB before accepting requests
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on("unhandledRejection", (error) => {
            console.error("Unhandled Rejection:", error.message);

            server.close(() => {
                process.exit(1);
            });
        });

        // Handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            console.error("Uncaught Exception:", error.message);

            server.close(() => {
                process.exit(1);
            });
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
