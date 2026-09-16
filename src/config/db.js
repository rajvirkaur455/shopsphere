import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI  || "mongodb://127.0.0.1:27017/shopsphere";
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.warn("Continuing without MongoDB connection. Start MongoDB locally or update the connection string in .env.");
    }
};

export default connectDB;