const db = require('../config/database');

class Order {
  static create(orderData, callback) {
    const { userId, items, totalAmount, shippingAddress, customerName, customerPhone } = orderData;
    
    db.serialize(() => {
      db.run(
        `INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_phone) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, totalAmount, shippingAddress, customerName, customerPhone],
        function(err) {
          if (err) {
            return callback(err);
          }
          
          const orderId = this.lastID;
          const stmt = db.prepare(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
          );

          let errorOccurred = null;
          
          // Выполняем все вставки последовательно
          const insertItems = () => {
            let index = 0;
            
            const insertNext = () => {
              if (index >= items.length) {
                stmt.finalize((err) => {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, orderId);
                  }
                });
                return;
              }
              
              const item = items[index];
              stmt.run([orderId, item.product_id, item.quantity, item.price], (err) => {
                if (err) {
                  errorOccurred = err;
                  stmt.finalize(() => callback(err));
                  return;
                }
                index++;
                insertNext();
              });
            };
            
            insertNext();
          };
          
          insertItems();
        }
      );
    });
  }

  static findByUserId(userId, callback) {
    const sql = `
      SELECT o.*, 
             COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    db.all(sql, [userId], callback);
  }

  static findById(orderId, userId, callback) {
    const sql = `
      SELECT o.* FROM orders o 
      WHERE o.id = ? AND o.user_id = ?
    `;
    
    db.get(sql, [orderId, userId], (err, order) => {
      if (err) {
        return callback(err);
      }
      
      if (!order) {
        return callback(new Error('Order not found'));
      }
      
      // Получаем items заказа
      db.all(`
        SELECT oi.*, p.name, p.brand, p.image_url 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId], (err, items) => {
        if (err) {
          return callback(err);
        }
        
        callback(null, { ...order, items });
      });
    });
  }
}

module.exports = Order;