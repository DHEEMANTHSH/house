const Property = require('../models/Property');

// @desc    Get all properties with optional filters & search
exports.getProperties = async (req, res) => {
  try {
    const { location, propertyType, purpose, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (location) query.location = new RegExp(location, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (purpose) query.purpose = purpose;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const properties = await Property.find(query);
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get featured properties for Home page
exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true }).limit(6);
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a new property with multiple Cloudinary image URLs (1 to 6 images)
exports.createProperty = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path || file.secure_url);
    } else if (req.file) {
      imageUrls = [req.file.path || req.file.secure_url];
    } else {
      imageUrls = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'];
    }

    const propertyData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      location: req.body.location,
      propertyType: req.body.propertyType,
      purpose: req.body.purpose || 'Rent',
      bedrooms: Number(req.body.bedrooms),
      bathrooms: Number(req.body.bathrooms),
      images: imageUrls,
      amenities: ["Parking", "Water Supply", "Security"],
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      owner: {
        name: req.body.ownerName,
        phone: req.body.ownerPhone,
        email: req.body.ownerEmail
      }
    };

    const newProperty = await Property.create(propertyData);
    return res.status(201).json({ success: true, data: newProperty });
  } catch (error) {
    console.error("Property creation error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Real-time property booking & payment simulation
exports.bookProperty = async (req, res) => {
  try {
    const { paymentMethod, amount, userEmail } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    console.log(`[REAL-TIME BOOKING] Property: ${property.name} | Amount: ₹${amount} | Method: ${paymentMethod}`);

    res.status(200).json({
      success: true,
      message: 'Booking and payment processed successfully in real time.',
      bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};