const express = require("express");
const router = express.Router();

// 1. Import the EXACT names we exported from the controller
const { register, login } = require("../controllers/authController");

// 2. Route them!
router.post("/register", register);
router.post("/login", login);


module.exports = router;
