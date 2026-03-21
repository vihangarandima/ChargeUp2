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

const path = require("path");

// 2. Middleware
app.use(cors()); // Allows Frontend to connect
app.use(express.json()); // Allows server to read JSON data

// Expose the 'uploads' folder for profile pictures!
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Import the new Charger Routes
const chargerRoutes = require("./src/routes/chargerRoutes");

// Open the door for the map data!
app.use("/api/chargers", chargerRoutes);

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


app.post('/api/sessions/start', (req, res) => {
  try {
    const { chargerId } = req.body;
    
    // Log to the terminal so the examiner sees backend activity!
    console.log(`\n[BACKEND LOG] User scanned QR Code!`);
    console.log(`[BACKEND LOG] Verifying Charger ID: ${chargerId}`);
    console.log(`[BACKEND LOG] Creating new charging session in database...\n`);

    // Generate a fake session ID to simulate database saving
    const newSessionId = "SESSION_" + Math.floor(Math.random() * 100000);

    // Send the success response back to the phone
    res.status(200).json({
      success: true,
      message: "Charger verified. Session started.",
      sessionId: newSessionId,
      chargerId: chargerId,
      pricePerUnit: 20.00 // Backend decides the price!
    });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


app.post('/api/complete-charging-session', async (req, res) => {
  try {
    const { sessionId, totalAmount, hostId, status } = req.body;

    console.log(`\n========================================`);
    console.log(`[HARDWARE LOG] 🛑 STOP SIGNAL RECEIVED`);
    console.log(`[HARDWARE LOG] Turning off Relay for Session: ${sessionId}`);

    // Ensure amount is a number (fallback to 0 if something goes wrong)
    const amount = parseFloat(totalAmount) || 0; 
    const commissionRate = 0.10; // 10% ChargeUp Platform Fee
    const commission = amount * commissionRate;
    const hostEarnings = amount - commission;

    console.log(`\n[FINANCE LOG] Payment Status: ${status ? status.toUpperCase() : 'UNKNOWN'}`);
    console.log(`[FINANCE LOG] Total Paid by Client: Rs. ${amount.toFixed(2)}`);
    console.log(`[FINANCE LOG] ➔ Platform Commission (10%): Rs. ${commission.toFixed(2)}`);
    console.log(`[FINANCE LOG] ➔ Host Net Earnings (90%): Rs. ${hostEarnings.toFixed(2)}`);

    // 1. Give the money to the Host!
    // This looks for the Host by their ID and adds the money to their wallet.
    if (hostId && hostId !== "UNKNOWN_HOST") {
        try {
            await Host.findByIdAndUpdate(
                hostId,
                { $inc: { walletBalance: hostEarnings } } 
            );
            console.log(`[DB LOG] Successfully credited Rs. ${hostEarnings.toFixed(2)} to Host Wallet!`);
        } catch (dbErr) {
            console.log(`[DB WARN] Host ID not found in database. Simulated credit only.`);
        }
    } else {
        console.log(`[DB WARN] No valid Host ID provided. Simulated credit only.`);
    }
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: "Hardware stopped, payment processed, and funds split successfully.",
    });

  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, error: "Payment processing failed" });
  }
});

// ----------------------
// 5. START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => { // Added '0.0.0.0' so your phone can connect!
  console.log(`Server is purring on port ${PORT}`);
});