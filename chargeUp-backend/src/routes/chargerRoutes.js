const express = require("express");
const router = express.Router();
const {
  createCharger,
  getAllChargers,
  getLatestCharger,
  getChargerById,
} = require("../controllers/chargerController");

// The door for chargers!
router.post("/", createCharger);
//  The GET route (Database -> Phone)
router.get("/", getAllChargers);
router.get("/latest", getLatestCharger);
// 🌟 NEW: Fetch a single charger by its ID (used by station-details screen)
router.get("/:id", getChargerById);
module.exports = router;