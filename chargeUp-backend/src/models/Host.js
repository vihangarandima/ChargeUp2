const mongoose = require("mongoose");

const hostSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  idNumber: { type: String, required: true },
  telephone: { type: String, required: true },
  chargerType: { type: String, required: true },
});

module.exports = mongoose.model("Host", hostSchema);
