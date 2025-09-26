const Property = require("../model/Property");
const {fetchProperties, fetchPropertyById, hybridSearch, getRecommendations} = require("../services/propertyService");

// Controller for GET / - Get all properties with pagination and sorting
exports.getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const sortField = req.query.sort || "price";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const result = await fetchProperties({
      page,
      limit,
      filters: {}, 
      sort: { [sortField]: sortOrder }
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for GET /:id - Get property details by ID
exports.getProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await fetchPropertyById(id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for GET /search - Search properties by query, bhk, location
exports.searchProperties = async (req, res) => {
  try {
    const { query = "", bhk, location } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const result = await hybridSearch({ query, bhk, location, page, limit });
    if (!result || !result.data || result.data.length === 0) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for GET /recommendations/:id - Get recommended properties for a property ID
exports.recommendProperties = async (req, res) => {
  try {
    const id = req.params.id;
    const recs = await getRecommendations(id, 3);
    res.json({ recommendations: recs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
