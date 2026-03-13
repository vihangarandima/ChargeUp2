const mongoose = require("mongoose");

const chargerSchema = new mongoose.Schema(
  {
    // The details from your frontend form
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    chargerType: { type: String, required: true },
    
    // The coordinates we will get from the map screen
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    // Later, we can link this to the specific Host who is logged in!
    // hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  },
  { timestamps: true } // Automatically adds "createdAt" and "updatedAt" dates
);

module.exports = mongoose.model("Charger", chargerSchema);