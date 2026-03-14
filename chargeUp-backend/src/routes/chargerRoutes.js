const express = require("express");
const router = express.Router();
const { createCharger } = require("../controllers/chargerController");

// The door for chargers!
router.post("/", createCharger);

module.exports = router;