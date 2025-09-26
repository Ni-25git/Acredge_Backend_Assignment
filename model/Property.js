const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true }, 
  price: { type: Number, required: true },
  bhk: { type: Number, required: true },
  type: { type: String, required: true }, 
  description: { type: String },
}, { timestamps: true });


propertySchema.index({ title: "text", description: "text", location: "text" });

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
