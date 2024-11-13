import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Customer from "./models/customers.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURI = process.env.MONGODB_URI;

// Read customers from JSON file
const customers = JSON.parse(fs.readFileSync("./sampleData.json", "utf8"));

mongoose.set("debug", process.env.NODE_ENV !== "production"); // Debug only in development

const startServer = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("Database is Connected Successfully");

    // Seed the database (only if empty) with sample data from sampleData.json
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

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to get all customers
app.get("/getCustomers", async (req, res) => {
  try {
    const customerData = await Customer.find(); // Use the Customer model
    res.json(customerData);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});
