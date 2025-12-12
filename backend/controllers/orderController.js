const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = (req, res) => {
  const { items, shippingAddress, customerName, customerPhone } = req.body;
  const userId = req.userId;

  console.log('Creating order for user:', userId);
  console.log('Order data:', { items, shippingAddress, customerName, customerPhone });

  // Валидация
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  if (!shippingAddress || !customerName || !customerPhone) {
    return res.status(400).json({ error: 'Shipping information is required' });
  }

  // Рассчитываем общую сумму
  const totalAmount = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Создаем заказ
  Order.create(
    {
      userId,
      items,
      totalAmount,
      shippingAddress,
      customerName,
      customerPhone
    },
    (err, orderId) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Error creating order: ' + err.message });
      }

      // Обновляем количество товаров на складе
      items.forEach(item => {
        Product.updateStock(item.productId, item.quantity, (err) => {
          if (err) {
            console.error('Error updating stock for product:', item.productId, err);
          }
        });
      });

      res.status(201).json({
        message: 'Order created successfully',
        orderId,
        totalAmount
      });
    }
  );
};

exports.getUserOrders = (req, res) => {
  const userId = req.userId;

  Order.findByUserId(userId, (err, orders) => {
    if (err) {
      console.error('Error getting user orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(orders);
  });
};

exports.getOrderDetails = (req, res) => {
  const { orderId } = req.params;
  const userId = req.userId;

  Order.findById(orderId, userId, (err, order) => {
    if (err) {
      console.error('Error getting order details:', err);
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  });
};