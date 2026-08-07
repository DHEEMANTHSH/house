const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, index: true },
  propertyType: { type: String, required: true, index: true },
  purpose: { type: String, default: 'Rent' },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  images: [{ type: String }],
  
  amenities: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  owner: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  }
}, { timestamps: true });

// Prevent model overwrite error upon re-importing
module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);