import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Shopping backend is running!"
    });
});

app.use("/api/products", productRoutes);

export default app;