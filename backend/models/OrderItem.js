const db = require('../config/database');

class OrderItem {
  static getOrderItems(orderId, callback) {
    db.all(`
      SELECT oi.*, p.name, p.brand, p.image_url 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId], callback);
  }
}

module.exports = OrderItem;