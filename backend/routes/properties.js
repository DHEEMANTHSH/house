const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Property = require('../models/Property');
const {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  createProperty,
  bookProperty
} = require('../controllers/propertyController');

router.route('/').get(getProperties).post((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer company-auth-token-xyz') {
    return res.status(403).json({ success: false, error: 'Unauthorized access. Company login required.' });
  }
  next();
}, upload.array('images', 6), createProperty);

router.route('/featured').get(getFeaturedProperties);

router.route('/:id')
  .get(getPropertyById)
  .delete((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer company-auth-token-xyz') {
      return res.status(403).json({ success: false, error: 'Unauthorized. Company login required to delete.' });
    }
    next();
  }, async (req, res) => {
    try {
      const property = await Property.findByIdAndDelete(req.params.id);
      if (!property) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      res.json({ success: true, message: 'Property deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

router.route('/:id/book').post(bookProperty);

module.exports = router;