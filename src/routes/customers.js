import express from "express";
import mongoose from "mongoose";
import Customer from "../models/customers.js";

const router = express.Router();

// Get all customers
router.get("/getCustomers", async (req, res) => {
  try {
    const customerData = await Customer.find();
    res.json(customerData);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// Get customer by ID
router.get("/getCustomer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const customerData = await Customer.findById(id);
    if (!customerData) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(customerData);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

// Add a new customer
router.post("/addCustomer", async (req, res) => {
  const { name, age, email, address } = req.body;

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

// Delete a customer by ID
router.delete("/deleteCustomer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const customerData = await Customer.findByIdAndDelete(id);
    if (!customerData) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(customerData);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// Update a customer by ID
router.put("/updateCustomer/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  try {
    const updateData = {};
    if (req.body.address) {
      for (const [key, value] of Object.entries(req.body.address)) {
        updateData[`address.${key}`] = value;
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.json(updatedCustomer);
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Failed to update customer." });
  }
});

export default router;
