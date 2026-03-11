// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

// 1. Load your secret variables
dotenv.config();

// Import Models and Routes
// Perfectly matched variable name to the file!
const Host = require("./src/models/Host");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// 2. Middleware
app.use(cors()); // Allows Frontend to connect
app.use(express.json()); // Allows server to read JSON data

// 3. Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Vault Connected! 🔐"))
  .catch((err) => console.log("Vault Connection Failed:", err));

// ----------------------
// 4. ROUTES
// ----------------------

// Simple Test Route
app.get("/", (req, res) => {
  res.send("ChargeUp Backend is Running! ⚡");
});

// Auth Routes (Login, Register)
app.use("/api/auth", authRoutes);

// Host Details Route (Saves to DB!)
app.post("/api/host-details", async (req, res) => {
  try {
    const { fullName, address, idNumber, telephone, chargerType } = req.body;

    // Double-check that nothing is empty
    if (!fullName || !address || !idNumber || !telephone || !chargerType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new document using our Model (Now "Host" is correctly defined!)
    const newHostDetail = new Host({
      fullName,
      address,
      idNumber,
      telephone,
      chargerType,
    });

    // Save it to MongoDB Atlas!
    await newHostDetail.save();

    console.log("New Host Details saved:", newHostDetail.fullName);

    // Send a success message back to the phone
    res.status(201).json({ message: "Host details saved successfully!" });
  } catch (error) {
    console.error("Error saving host details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ----------------------
// 5. START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is purring on port ${PORT}`);
});
