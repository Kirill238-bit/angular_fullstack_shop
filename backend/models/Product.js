const db = require('../config/database');

class Product {
  static findAll(filters = {}, callback) {
    let sql = `
      SELECT p.*, 
             (SELECT COUNT(*) FROM products) as total_count
      FROM products p 
      WHERE 1=1
    `;
    const params = [];

    if (filters.brand) {
      sql += ' AND p.brand = ?';
      params.push(filters.brand);
    }

    if (filters.minPrice) {
      sql += ' AND p.price >= ?';
      params.push(parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(parseFloat(filters.maxPrice));
    }

    if (filters.search) {
      sql += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.inStock) {
      sql += ' AND p.in_stock = TRUE AND p.stock_quantity > 0';
    }

    // Сортировка
    if (filters.sortBy === 'price_asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (filters.sortBy === 'price_desc') {
      sql += ' ORDER BY p.price DESC';
    } else if (filters.sortBy === 'name_asc') {
      sql += ' ORDER BY p.name ASC';
    } else if (filters.sortBy === 'name_desc') {
      sql += ' ORDER BY p.name DESC';
    } else {
      sql += ' ORDER BY p.created_at DESC';
    }

    // Пагинация
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      sql += ' OFFSET ?';
      params.push(parseInt(filters.offset));
    }

    db.all(sql, params, callback);
  }

  static findById(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], callback);
  }

  static getBrands(callback) {
    db.all('SELECT DISTINCT brand FROM products ORDER BY brand', callback);
  }

  static getCategories(callback) {
    db.all('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category', callback);
  }

  static updateStock(productId, quantity, callback) {
    db.run(
      'UPDATE products SET stock_quantity = stock_quantity - ?, in_stock = (stock_quantity - ?) > 0 WHERE id = ?',
      [quantity, quantity, productId],
      callback
    );
  }
}

module.exports = Product;