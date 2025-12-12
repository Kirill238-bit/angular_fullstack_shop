const Product = require('../models/Product');

exports.getAllProducts = (req, res) => {
  const {
    brand,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    inStock,
    page = 1,
    limit = 12
  } = req.query;

  const filters = {
    brand,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    inStock: inStock === 'true'
  };

  // Пагинация
  const offset = (page - 1) * limit;
  filters.limit = parseInt(limit);
  filters.offset = offset;

  Product.findAll(filters, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Получаем бренды для фильтров
    Product.getBrands((err, brandRows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Получаем категории для фильтров
      Product.getCategories((err, categoryRows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const total = products.length > 0 ? products[0].total_count : 0;
        const totalPages = Math.ceil(total / limit);

        res.json({
          products: products.map(p => ({ ...p, total_count: undefined })),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalProducts: total,
            hasNext: page < totalPages,
            hasPrev: page > 1
          },
          filters: {
            brands: brandRows.map(b => b.brand),
            categories: categoryRows.map(c => c.category)
          }
        });
      });
    });
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  });
};

exports.getBrands = (req, res) => {
  Product.getBrands((err, brands) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(brands.map(b => b.brand));
  });
};

exports.getCategories = (req, res) => {
  Product.getCategories((err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories.map(c => c.category));
  });
};