const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelPackage',
    required: true
  },
  dayNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  activities: [{
    type: String
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique day numbers per package
itinerarySchema.index({ packageId: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);