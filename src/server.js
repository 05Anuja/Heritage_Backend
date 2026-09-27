import app from './app.js';

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


process.on('unhandledRejection', (error) => {
    console.log(error.message);
    console.log("Shutting down the server due to unhandled rejection")
    server.close(() => {
        process.exit(1);
    })
})

process.on('uncaughtException', (error) => {
    console.log(error.message);
    console.log("Shutting down the server due to uncaught exception")
    server.close(() => {
        process.exit(1);
    })
})