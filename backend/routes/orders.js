const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderDetails
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:orderId', authenticateToken, getOrderDetails);

module.exports = router;