// backend/src/models/User.js
const mongoose = require("mongoose");

// This is the Blueprint. Every user MUST have these details.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // You can't be a user without a name
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "client",
  },
  phone: {
    type: String,
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// We wrap this blueprint into a "Model" called 'User' and export it
module.exports = mongoose.model("User", userSchema);
