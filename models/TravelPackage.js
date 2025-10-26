const mongoose = require('mongoose');


const similarTourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  }
});


const travelPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  route: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  heroImage: {
    type: String,
    default: ''
  },
  included: [{
    type: String
  }],
  brochureUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  similarTours: [similarTourSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelPackage', travelPackageSchema);