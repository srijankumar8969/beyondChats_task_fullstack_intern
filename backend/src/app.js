import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Article from "./models/Article.js";
import articleRoutes from "./routes/articleRoutes.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("BeyondChats Backend Running");
});
app.use("/articles", articleRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Mongo error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
