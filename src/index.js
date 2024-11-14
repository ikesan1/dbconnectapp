import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Customer from "./models/customers.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURI = process.env.MONGODB_URI;

// --- IMPORT CUSTOMER DATA ---
// Dynamic resolving of file paths.
// We need the extra code to import sampleData.json because of the way node.js interprets file paths.
// File paths are interpreted relative to the CWD (current working directory) of the node process.

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read customers from JSON file
const customers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "sampleData.json"), "utf8")
);
// The following code also works, however, it is not recommended to use it in production due to scalability issues.
// const customers = JSON.parse(
//   fs.readFileSync("./src/data/sampleData.json", "utf8")
// );

// --- DATABASE CONNECTION ---
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

// --- EXPRESS MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---

// Get request to fetch all customers
app.get("/getCustomers", async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray()); // List all collections in the database
  try {
    const customerData = await Customer.find();
    res.json(customerData);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Post request to add a new customer
app.post("/addCustomer", async (req, res) => {
  const { name, age, email, address } = req.body;

  // Validate required fields
  if (
    !name ||
    !age ||
    !email ||
    !address ||
    !address.street ||
    !address.city ||
    !address.postcode
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newCustomer = new Customer(req.body);

  try {
    const customerData = await newCustomer.save();
    res.status(201).json(customerData);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user." });
  }
});
