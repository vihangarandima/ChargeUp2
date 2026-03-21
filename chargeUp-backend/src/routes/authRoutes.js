const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// 1. Import the EXACT names we exported from the controller
const { register, login, getProfile, updateProfile } = require("../controllers/authController");

// Local storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

// 2. Route them!
router.post("/register", register);
router.post("/login", login);

// Extra routes for Profiles
router.get("/profile", getProfile);
router.put("/profile/update", upload.single("profileImage"), updateProfile);

module.exports = router;
