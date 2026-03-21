/**
 * SESSIONS & PAYMENTS TESTS
 *
 * Covers:
 *   POST /api/host-details
 *   POST /api/sessions/start
 *   POST /api/complete-charging-session
 *
 * Setup needed (run once in chargeUp-backend/):
 *   npm install --save-dev jest supertest mongodb-memory-server
 */

const request  = require("supertest");
const express  = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Host = require("../../chargeUp-backend/src/models/Host");

// ─── Rebuild the three inline routes from server.js ─────────────────────────
function buildApp() {
  const app = express();
  app.use(express.json());

  // POST /api/host-details
  app.post("/api/host-details", async (req, res) => {
    try {
      const { fullName, address, idNumber, telephone, chargerType } = req.body;
      if (!fullName || !address || !idNumber || !telephone || !chargerType) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const newHostDetail = new Host({ fullName, address, idNumber, telephone, chargerType });
      await newHostDetail.save();
      res.status(201).json({ message: "Host details saved successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  // POST /api/sessions/start
  app.post("/api/sessions/start", (req, res) => {
    try {
      const { chargerId } = req.body;
      const newSessionId = "SESSION_" + Math.floor(Math.random() * 100000);
      res.status(200).json({
        success: true,
        message: "Charger verified. Session started.",
        sessionId: newSessionId,
        chargerId: chargerId,
        pricePerUnit: 20.00,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  });

  // POST /api/complete-charging-session
  app.post("/api/complete-charging-session", async (req, res) => {
    try {
      const { sessionId, totalAmount, hostId, status } = req.body;
      const amount = parseFloat(totalAmount) || 0;
      const commission = amount * 0.10;
      const hostEarnings = amount - commission;

      if (hostId && hostId !== "UNKNOWN_HOST") {
        try {
          await Host.findByIdAndUpdate(hostId, { $inc: { walletBalance: hostEarnings } });
        } catch (_) { /* not found — simulated credit */ }
      }

      res.status(200).json({
        success: true,
        message: "Hardware stopped, payment processed, and funds split successfully.",
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Payment processing failed" });
    }
  });

  return app;
}

// ─── DB lifecycle ────────────────────────────────────────────────────────────
let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = buildApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Host.deleteMany({});
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/host-details
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/host-details", () => {
  const validHost = {
    fullName: "Nuwan Perera",
    address: "45 Duplication Rd, Colombo 3",
    idNumber: "198812345678",
    telephone: "0761234567",
    chargerType: "DC Fast Charger",
  };

  test("201 — saves host legal details successfully", async () => {
    const res = await request(app).post("/api/host-details").send(validHost);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Host details saved successfully!");
  });

  test("201 — persists the host document in the database", async () => {
    await request(app).post("/api/host-details").send(validHost);
    const saved = await Host.findOne({ idNumber: validHost.idNumber });

    expect(saved).not.toBeNull();
    expect(saved.fullName).toBe(validHost.fullName);
    expect(saved.chargerType).toBe(validHost.chargerType);
  });

  test("400 — rejects when fullName is missing", async () => {
    const { fullName, ...missing } = validHost;
    const res = await request(app).post("/api/host-details").send(missing);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required.");
  });

  test("400 — rejects when telephone is missing", async () => {
    const { telephone, ...missing } = validHost;
    const res = await request(app).post("/api/host-details").send(missing);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required.");
  });

  test("400 — rejects when chargerType is missing", async () => {
    const { chargerType, ...missing } = validHost;
    const res = await request(app).post("/api/host-details").send(missing);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required.");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/sessions/start
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/sessions/start", () => {
  test("200 — returns success=true when a valid chargerId is sent", async () => {
    const res = await request(app)
      .post("/api/sessions/start")
      .send({ chargerId: "6634abc123def456abc789ab" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Charger verified. Session started.");
  });

  test("200 — response includes a generated sessionId string", async () => {
    const res = await request(app)
      .post("/api/sessions/start")
      .send({ chargerId: "CHARGER_001" });

    expect(typeof res.body.sessionId).toBe("string");
    expect(res.body.sessionId).toMatch(/^SESSION_\d+$/);
  });

  test("200 — response echoes back the chargerId that was sent", async () => {
    const chargerId = "6634abc123def456abc789ab";
    const res = await request(app)
      .post("/api/sessions/start")
      .send({ chargerId });

    expect(res.body.chargerId).toBe(chargerId);
  });

  test("200 — response includes a pricePerUnit of 20.00", async () => {
    const res = await request(app)
      .post("/api/sessions/start")
      .send({ chargerId: "any" });

    expect(res.body.pricePerUnit).toBe(20.0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/complete-charging-session
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/complete-charging-session", () => {
  test("200 — returns success=true on a valid paid session", async () => {
    const res = await request(app)
      .post("/api/complete-charging-session")
      .send({
        sessionId: "SESSION_12345",
        totalAmount: "100.00",
        hostId: "UNKNOWN_HOST",
        status: "paid",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("commission — host wallet receives 90% of the total amount", async () => {
    // Create a real host in DB so the $inc actually runs
    const host = await Host.create({
      fullName: "Wallet Host",
      address: "1 Wallet St",
      idNumber: "123456789012",
      telephone: "0701234567",
      chargerType: "Type 2 AC",
    });

    const totalAmount = "200.00";
    const expectedEarnings = 200 * 0.9; // 180

    await request(app)
      .post("/api/complete-charging-session")
      .send({
        sessionId: "SESSION_99999",
        totalAmount,
        hostId: host._id.toString(),
        status: "paid",
      });

    const updated = await Host.findById(host._id);
    expect(updated.walletBalance).toBe(expectedEarnings);
  });

  test("commission — platform keeps exactly 10% (walletBalance not the full amount)", async () => {
    const host = await Host.create({
      fullName: "Commission Host",
      address: "2 Commission Lane",
      idNumber: "987654321012",
      telephone: "0709876543",
      chargerType: "DC Fast Charger",
    });

    await request(app)
      .post("/api/complete-charging-session")
      .send({
        sessionId: "SESSION_COM",
        totalAmount: "500.00",
        hostId: host._id.toString(),
        status: "paid",
      });

    const updated = await Host.findById(host._id);
    // 10% commission = 50, host gets 450
    expect(updated.walletBalance).toBe(450);
  });

  test("200 — succeeds gracefully when hostId is 'UNKNOWN_HOST' (simulated credit)", async () => {
    const res = await request(app)
      .post("/api/complete-charging-session")
      .send({
        sessionId: "SESSION_NOHOST",
        totalAmount: "50.00",
        hostId: "UNKNOWN_HOST",
        status: "paid",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("200 — handles missing totalAmount by defaulting to 0", async () => {
    const res = await request(app)
      .post("/api/complete-charging-session")
      .send({
        sessionId: "SESSION_ZERO",
        hostId: "UNKNOWN_HOST",
        status: "paid",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
