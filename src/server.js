import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/careers", careerRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
});
