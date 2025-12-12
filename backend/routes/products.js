const express = require('express');
const {
  getAllProducts,
  getProductById,
  getBrands,
  getCategories
} = require('../controllers/productController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getAllProducts);
router.get('/brands', getBrands);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

module.exports = router;