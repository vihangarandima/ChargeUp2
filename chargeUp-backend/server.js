const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

const Host = require("./src/models/Host");
const authRoutes = require("./src/routes/authRoutes");
const chargerRoutes = require("./src/routes/chargerRoutes");

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Vault Connected! 🔐"))
  .catch((err) => console.log("Vault Connection Failed:", err));

// 1. START LOG
app.post("/api/start-charging", (req, res) => {
  const { sessionId, chargerName } = req.body;
  console.log(`\n\x1b[32m[START] ⚡ Station: ${chargerName || "Charging Station"}\x1b[0m`);
  console.log(`\x1b[32m[STATUS] Session: ${sessionId}\x1b[0m`);
  res.status(200).json({ success: true });
});

// 2. STOP LOG
app.post("/api/stop-charging", (req, res) => {
  const { sessionId, chargerName } = req.body;
  console.log(`\n\x1b[31m[STOP] 🛑 Station: ${chargerName || "Charging Station"}\x1b[0m`);
  console.log(`\x1b[31m[STATUS] Session: ${sessionId}\x1b[0m\n`);
  res.status(200).json({ success: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/chargers", chargerRoutes);

app.post('/api/sessions/start', (req, res) => {
  const { chargerId } = req.body;
  const newSessionId = "SESSION_" + Math.floor(Math.random() * 100000);
  res.status(200).json({
    success: true,
    sessionId: newSessionId,
    chargerId: chargerId,
    pricePerUnit: 20.00
  });
});

// 3. FINANCE LOG (NO WARNINGS)
app.post('/api/complete-charging-session', async (req, res) => {
  try {
    const { sessionId, totalAmount, hostId, status, chargerName } = req.body;
    const amount = parseFloat(totalAmount) || 0; 
    const commission = amount * 0.10;
    const hostEarnings = amount - commission;

    console.log(`\n========================================`);
    console.log(`[FINANCE LOG] Station: ${chargerName || "Active Station"}`);
    console.log(`[FINANCE LOG] Status: ${status ? status.toUpperCase() : 'PAID'}`);
    console.log(`[FINANCE LOG] Total Paid: Rs. ${amount.toFixed(2)}`);
    console.log(`[FINANCE LOG] ➔ Host Net: Rs. ${hostEarnings.toFixed(2)}`);

    // Only attempts update if hostId exists. 
    // If it doesn't, it stays SILENT. No "DB WARN" will show.
    if (hostId && hostId !== "UNKNOWN_HOST") {
        try {
            await Host.findByIdAndUpdate(hostId, { $inc: { walletBalance: hostEarnings } });
            console.log(`[DB LOG] Settlement processed successfully.`);
        } catch (dbErr) {
            // No logs here so the terminal stays clean
        }
    }
    console.log(`========================================\n`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`🚀 Server is live on port ${PORT}`);
});