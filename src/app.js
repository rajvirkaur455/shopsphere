import express from "express";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Shopping backend is running!"
    });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

export default app;