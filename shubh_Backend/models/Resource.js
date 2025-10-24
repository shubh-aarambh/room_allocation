const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  capacity: { type: Number },
  location: { type: String },
  availableFrom: { type: String }, // "08:00"
  availableTo: { type: String },   // "18:00"
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
