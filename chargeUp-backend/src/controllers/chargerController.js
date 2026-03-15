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
    res
      .status(500)
      .json({ message: "Failed to save charger", error: error.message });
  }
};


// 🌟 NEW: Function to get all chargers from the database
const getAllChargers = async (req, res) => {
  try {
    const chargers = await Charger.find(); // Grabs everything from MongoDB!
    res.status(200).json(chargers);
  } catch (error) {
    console.error("❌ Error fetching chargers:", error);
    res.status(500).json({ message: "Failed to fetch chargers", error: error.message });
  }
};

module.exports = { createCharger };
module.exports = { createCharger, getAllChargers };
