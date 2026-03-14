const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if this user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 THE FIX: Encrypt (hash) the password before saving!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the SCRAMBLED password
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save it to the database!
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found! Please sign up." });
    }

    // Now bcrypt will successfully compare your typed password with the encrypted one!
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password! Try again." });
    }

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
};

const Charger = require("../models/Charger");

const createCharger = async (req, res) => {
  try {
    console.log("📦 Incoming charger data from phone:", req.body);

    // 1. Create a new charger using the data from the phone
    const newCharger = new Charger(req.body);

    // 2. Save it to MongoDB
    const savedCharger = await newCharger.save();

    // 3. Send a success message back
    res.status(201).json({
      message: "Charger location saved successfully!",
      charger: savedCharger,
    });
  } catch (error) {
    console.error("❌ Error saving charger:", error);
    res.status(500).json({ message: "Failed to save charger", error: error.message });
  }
};

module.exports = { createCharger };

module.exports = { register, login };
