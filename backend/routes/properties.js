const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  createProperty,
  bookProperty
} = require('../controllers/propertyController');

router.route('/').get(getProperties).post(upload.single('image'), createProperty);
router.route('/featured').get(getFeaturedProperties);
router.route('/:id').get(getPropertyById);
router.route('/:id/book').post(bookProperty);

module.exports = router;