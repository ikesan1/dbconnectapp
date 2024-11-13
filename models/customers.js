import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

export default mongoose.model("Customer", customerSchema);
