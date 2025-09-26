const express = require("express");
const { getAllProperties, getProperty, searchProperties, recommendProperties } = require("../controllers/propertyController");

const router = express.Router();

// Get all properties
router.get("/", getAllProperties);     

// Search properties by query parameters
router.get("/search", searchProperties);    

// Get recommended properties for a specific property ID
router.get("/recommendations/:id", recommendProperties);

// Get details of a property by ID
router.get("/:id", getProperty);          

module.exports = router;
