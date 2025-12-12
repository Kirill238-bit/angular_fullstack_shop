const User = require('../models/User');

exports.getProfile = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const { firstName, lastName, phone, address } = req.body;

  // Валидация
  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  User.updateProfile(req.userId, { firstName, lastName, phone, address }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating profile' });
    }

    // Получаем обновленные данные пользователя
    User.findById(req.userId, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        message: 'Profile updated successfully',
        user
      });
    });
  });
};