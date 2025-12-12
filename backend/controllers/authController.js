const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Валидация
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Проверяем, существует ли пользователь
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Хешируем пароль и создаем пользователя
      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
        }

        User.create(
          { email, password: hashedPassword, firstName, lastName },
          (err, userId) => {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ error: 'Error creating user' });
            }

            // Генерируем JWT токен
            const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
            
            res.status(201).json({
              message: 'User registered successfully',
              token,
              user: {
                id: userId,
                email,
                firstName,
                lastName
              }
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Server error in register:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ищем пользователя
    User.findByEmail(email, (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Проверяем пароль
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (!isValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          }
        });
      });
    });
  } catch (error) {
    console.error('Server error in login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMe = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
};