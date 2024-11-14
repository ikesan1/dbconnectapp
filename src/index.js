import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const MONGOURI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the customers routes
app.use("/", customerRoutes);

// Database connection
const startServer = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("Database is Connected Successfully");
    app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

startServer();
