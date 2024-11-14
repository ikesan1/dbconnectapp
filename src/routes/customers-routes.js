import express from "express";
import {
  getCustomers,
  getCustomerById,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customersController.js";

const router = express.Router();

// Routes map to controllers
router.get("/getCustomers", getCustomers);
router.get("/getCustomer/:id", getCustomerById);
router.post("/addCustomer", addCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);
router.put("/updateCustomer/:id", updateCustomer);

export default router;
