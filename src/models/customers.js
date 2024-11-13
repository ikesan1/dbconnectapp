import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: String, required: true },
  },
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
