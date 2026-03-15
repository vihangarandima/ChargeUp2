const express = require("express");
const router = express.Router();
const { createCharger } = require("../controllers/chargerController");

// The door for chargers!
router.post("/", createCharger);
//  The GET route (Database -> Phone)
router.get("/", getAllChargers);

module.exports = router;
