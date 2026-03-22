/**
 * AUTH TESTS — /api/auth
 *
 * Covers:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   GET  /api/auth/profile
 *   PUT  /api/auth/profile/update
 *
 * Setup needed (run once in chargeUp-backend/):
 *   npm install --save-dev jest supertest mongodb-memory-server @types/jest
 *
 * Add to chargeUp-backend/package.json:
 *   "scripts": { "test": "jest --testPathPattern=test" }
 *   "jest": { "testEnvironment": "node" }
 */

const request  = require("supertest");
const express  = require("express");
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const path     = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");

// ─── Models ────────────────────────────────────────────────────────────────
const User = require("../../chargeUp-backend/src/models/User");

// ─── Build a minimal test app (mirrors authRoutes.js) ──────────────────────
const multer = require("multer");
const upload = multer({ dest: "/tmp/test-uploads/" });
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../../chargeUp-backend/src/controllers/authController");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile", getProfile);
  app.put("/api/auth/profile/update", upload.single("profileImage"), updateProfile);
  return app;
}

// ─── DB lifecycle ───────────────────────────────────────────────────────────
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
  await User.deleteMany({});
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/auth/register", () => {
  const validPayload = {
    name: "Sanuda Test",
    email: "sanuda@test.com",
    password: "secure123",
    role: "client",
  };

  test("201 — creates a new client account successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully!");
  });

  test("201 — creates a host account when role is 'host'", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validPayload, role: "host" });

    expect(res.status).toBe(201);
    const saved = await User.findOne({ email: validPayload.email });
    expect(saved.role).toBe("host");
  });

  test("201 — defaults role to 'client' when no role is provided", async () => {
    const { role, ...noRole } = validPayload;
    const res = await request(app).post("/api/auth/register").send(noRole);

    expect(res.status).toBe(201);
    const saved = await User.findOne({ email: validPayload.email });
    expect(saved.role).toBe("client");
  });

  test("201 — password is stored hashed, not plaintext", async () => {
    await request(app).post("/api/auth/register").send(validPayload);
    const saved = await User.findOne({ email: validPayload.email });
    expect(saved.password).not.toBe(validPayload.password);
    const match = await bcrypt.compare(validPayload.password, saved.password);
    expect(match).toBe(true);
  });

  test("400 — rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send(validPayload);
    const res = await request(app).post("/api/auth/register").send(validPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════════════════════════
describe("POST /api/auth/login", () => {
  const credentials = { email: "login@test.com", password: "pass1234" };

  beforeEach(async () => {
    // seed a user
    const salt = await bcrypt.genSalt(10);
    await User.create({
      name: "Login User",
      email: credentials.email,
      password: await bcrypt.hash(credentials.password, salt),
      role: "client",
    });
  });

  test("200 — returns user id, name, email and role on success", async () => {
    const res = await request(app).post("/api/auth/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.user).toMatchObject({
      email: credentials.email,
      role: "client",
    });
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name");
  });

  test("400 — rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ ...credentials, password: "wrongpass" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Wrong password! Try again.");
  });

  test("400 — rejects non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "any" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User not found! Please sign up.");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/auth/profile
// ═══════════════════════════════════════════════════════════════════════════
describe("GET /api/auth/profile", () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: "Profile User",
      email: "profile@test.com",
      password: "hashed",
    });
    userId = user._id.toString();
  });

  test("200 — returns user profile without password field", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("profile@test.com");
    expect(res.body).not.toHaveProperty("password");
  });

  test("401 — returns 401 when no Authorization header is sent", async () => {
    const res = await request(app).get("/api/auth/profile");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("404 — returns 404 for a valid ObjectId that does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PUT /api/auth/profile/update
// ═══════════════════════════════════════════════════════════════════════════
describe("PUT /api/auth/profile/update", () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: "Before Update",
      email: "update@test.com",
      password: "hashed",
      phone: "0700000000",
    });
    userId = user._id.toString();
  });

  test("200 — updates name and phone successfully", async () => {
    const res = await request(app)
      .put("/api/auth/profile/update")
      .set("Authorization", `Bearer ${userId}`)
      .send({ name: "After Update", phone: "0711111111" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("After Update");
    expect(res.body.phone).toBe("0711111111");
    expect(res.body).not.toHaveProperty("password");
  });

  test("200 — updates email successfully", async () => {
    const res = await request(app)
      .put("/api/auth/profile/update")
      .set("Authorization", `Bearer ${userId}`)
      .send({ email: "new@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("new@test.com");
  });

  test("401 — returns 401 when no Authorization header is sent", async () => {
    const res = await request(app)
      .put("/api/auth/profile/update")
      .send({ name: "Hacker" });

    expect(res.status).toBe(401);
  });
});
