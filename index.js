import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import Customer from "./models/customers.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURI = process.env.MONGODB_URI;

mongoose.set("debug", true);

const startServer = async () => {
  try {
    await mongoose.connect(MONGOURI);
    console.log("Database is Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const UserModel = mongoose.model("users", userSchema);

app.get("/getUsers", async (req, res) => {
  const userData = await UserModel.find();
  res.json(userData);
});
