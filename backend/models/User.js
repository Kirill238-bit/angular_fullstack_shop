const db = require('../config/database');

class User {
  static create(userData, callback) {
    const { email, password, firstName, lastName } = userData;
    const sql = `INSERT INTO users (email, password, first_name, last_name) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [email, password, firstName, lastName], function(err) {
      callback(err, this.lastID);
    });
  }

  static findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static findById(id, callback) {
    db.get(
      `SELECT id, email, first_name, last_name, phone, address, created_at 
       FROM users WHERE id = ?`, 
      [id], 
      callback
    );
  }

  static updateProfile(userId, profileData, callback) {
    const { firstName, lastName, phone, address } = profileData;
    const sql = `UPDATE users 
                 SET first_name = ?, last_name = ?, phone = ?, address = ?, 
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
    
    db.run(sql, [firstName, lastName, phone, address, userId], callback);
  }
}

module.exports = User;