import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Customer from "./models/customers.js";
import customerRoutes from "./routes/customers.js"; // Import routes

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURI = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "sampleData.json"), "utf8")
);

mongoose.set("debug", process.env.NODE_ENV !== "production");

const startServer = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("Database is Connected Successfully");

    const existingCustomers = await Customer.find();
    if (existingCustomers.length === 0) {
      await Customer.insertMany(customers);
      console.log("Sample customer data inserted.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

startServer();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", customerRoutes);
