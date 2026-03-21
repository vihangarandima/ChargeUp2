/**
 * CHARGER TESTS — /api/chargers
 *
 * Covers:
 *   GET  /api/chargers
 *   GET  /api/chargers/latest
 *   GET  /api/chargers/:id
 *   POST /api/chargers
 *
 * Setup needed (run once in chargeUp-backend/):
 *   npm install --save-dev jest supertest mongodb-memory-server
 */

const request  = require("supertest");
const express  = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Charger = require("../../chargeUp-backend/src/models/Charger");
const {
  createCharger,
  getAllChargers,
  getLatestCharger,
  getChargerById,
} = require("../../chargeUp-backend/src/controllers/chargerController");

// ─── Build a minimal test app ───────────────────────────────────────────────
function buildApp() {
  const app = express();
  app.use(express.json());
  app.get("/api/chargers/latest", getLatestCharger); // must be before /:id
  app.get("/api/chargers/:id", getChargerById);
  app.get("/api/chargers", getAllChargers);
  app.post("/api/chargers", createCharger);
  return app;
}

// ─── Sample charger data ─────────────────────────────────────────────────────
const sampleCharger = {
  fullName: "John Host",
  address: "123 Galle Road, Colombo",
  idNumber: "199012345678",
  phone: "0771234567",
  chargerType: "Type 2 AC",
  location: { latitude: 6.9271, longitude: 79.8612 },
};

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
  await Charger.deleteMany({});
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/chargers
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/chargers", () => {
  test("201 — saves a new charger and returns it", async () => {
    const res = await request(app).post("/api/chargers").send(sampleCharger);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Charger location saved successfully!");
    expect(res.body.charger).toMatchObject({
      fullName: sampleCharger.fullName,
      chargerType: sampleCharger.chargerType,
    });
    expect(res.body.charger).toHaveProperty("_id");
  });

  test("201 — persists coordinates correctly in location sub-document", async () => {
    const res = await request(app).post("/api/chargers").send(sampleCharger);

    expect(res.body.charger.location.latitude).toBe(sampleCharger.location.latitude);
    expect(res.body.charger.location.longitude).toBe(sampleCharger.location.longitude);
  });

  test("500 — returns error when required fields are missing", async () => {
    const { fullName, ...missing } = sampleCharger; // remove required field
    const res = await request(app).post("/api/chargers").send(missing);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/chargers
// ═══════════════════════════════════════════════════════════════════════════
describe("GET /api/chargers", () => {
  test("200 — returns empty array when no chargers exist", async () => {
    const res = await request(app).get("/api/chargers");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("200 — returns all chargers after inserting multiple", async () => {
    await Charger.create(sampleCharger);
    await Charger.create({ ...sampleCharger, fullName: "Second Host", address: "456 Kandy Rd" });

    const res = await request(app).get("/api/chargers");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("200 — each charger includes required fields", async () => {
    await Charger.create(sampleCharger);
    const res = await request(app).get("/api/chargers");

    const charger = res.body[0];
    expect(charger).toHaveProperty("fullName");
    expect(charger).toHaveProperty("chargerType");
    expect(charger).toHaveProperty("location");
    expect(charger.location).toHaveProperty("latitude");
    expect(charger.location).toHaveProperty("longitude");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/chargers/latest
// ═══════════════════════════════════════════════════════════════════════════
describe("GET /api/chargers/latest", () => {
  test("200 — returns null when no chargers exist", async () => {
    const res = await request(app).get("/api/chargers/latest");

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  test("200 — returns the most recently created charger", async () => {
    await Charger.create({ ...sampleCharger, fullName: "Old Host" });
    // small delay to ensure different createdAt
    await new Promise((r) => setTimeout(r, 10));
    await Charger.create({ ...sampleCharger, fullName: "New Host" });

    const res = await request(app).get("/api/chargers/latest");

    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("New Host");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/chargers/:id
// ═══════════════════════════════════════════════════════════════════════════
describe("GET /api/chargers/:id", () => {
  test("200 — returns the correct charger by its MongoDB id", async () => {
    const created = await Charger.create(sampleCharger);
    const res = await request(app).get(`/api/chargers/${created._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(created._id.toString());
    expect(res.body.fullName).toBe(sampleCharger.fullName);
  });

  test("404 — returns 404 for a valid ObjectId that does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/chargers/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Charger not found.");
  });

  test("500 — returns 500 for a completely invalid id format", async () => {
    const res = await request(app).get("/api/chargers/not-a-valid-id");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
});
