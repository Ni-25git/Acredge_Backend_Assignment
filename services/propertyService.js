const Property = require("../model/Property");

/**

 @param {Object} options 
 */
exports.fetchProperties = async ({ page = 1, limit = 10, filters = {}, sort = { price: 1 } }) => {
  const skip = (page - 1) * limit;
  const total = await Property.countDocuments(filters);
  const data = await Property.find(filters).sort(sort).skip(skip).limit(limit).lean();
  return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
};

exports.fetchPropertyById = async (id) => {
  return Property.findById(id).lean();
};

exports.hybridSearch = async ({ query = "", bhk, location, page = 1, limit = 10 }) => {
  const filters = {};

  if (bhk) filters.bhk = Number(bhk);

  if (location) filters.location = new RegExp(escapeRegex(location), "i");

  
  const semanticMap = {
    "cyberhub": "Gurgaon",
    "sector 18": "Noida",
    "banjara hills": "Hyderabad",
    "connaught place": "Delhi",
    "marine drive": "Mumbai"
  };

  if (query) {
 
    const qLower = query.toLowerCase();
    for (const [k, v] of Object.entries(semanticMap)) {
      if (qLower.includes(k)) {
        filters.location = new RegExp(escapeRegex(v), "i");
        break;
      }
    }
  }


  let mongoFilter = { ...filters };
  if (query) {
    
    try {
      mongoFilter.$text = { $search: query };
      return await exports.fetchProperties({ page, limit, filters: mongoFilter });
    } catch (e) {
    
      delete mongoFilter.$text;
      mongoFilter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } }
      ];
      return await exports.fetchProperties({ page, limit, filters: mongoFilter });
    }
  } else {
    return exports.fetchProperties({ page, limit, filters: mongoFilter });
  }
};

exports.getRecommendations = async (id, limit = 3) => {

  const base = await Property.findById(id).lean();
  if (!base) return [];

  const candidates = await Property.find({
    _id: { $ne: base._id }
  }).lean();

  const scored = candidates.map(c => {
    let score = 0;
    if (c.location && base.location && c.location.toLowerCase() === base.location.toLowerCase()) score += 2;
    if (c.bhk === base.bhk) score += 1;
  
    const priceDiff = Math.abs(c.price - base.price);
    return { prop: c, score, priceDiff };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.priceDiff - b.priceDiff; 
  });

  return scored.slice(0, limit).map(s => s.prop);
};


function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
