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


module.exports = { createCharger };