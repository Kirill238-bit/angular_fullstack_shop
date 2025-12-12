const db = require('../config/database');

const sampleProducts = [
  {
    name: 'Chanel No. 5',
    brand: 'Chanel',
    description: 'Легендарный женский аромат с нотами иланг-иланга, нероли и ванили. Элегантный и timeless.',
    price: 12500,
    image_url: 'https://images.unsplash.com/photo-1547887535-2c0d234b5c1a?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 15
  },
  {
    name: 'Dior Sauvage',
    brand: 'Dior',
    description: 'Свежий и пряный мужской аромат с нотами перца, бергамота и амбры. Для уверенных в себе мужчин.',
    price: 9500,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 20
  },
  {
    name: 'Black Opium',
    brand: 'Yves Saint Laurent',
    description: 'Соблазнительный женский аромат с кофейными и ванильными аккордами. Энергичный и загадочный.',
    price: 8900,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 90,
    category: 'Eau de Parfum',
    stock_quantity: 12
  },
  {
    name: 'Acqua di Gio',
    brand: 'Giorgio Armani',
    description: 'Свежий морской аромат для мужчин с нотами цитрусов и морских нот. Идеален для лета.',
    price: 7800,
    image_url: 'https://images.unsplash.com/photo-1547887535-2c0d234b5c1a?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 18
  },
  {
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    description: 'Сладкий цветочный аромат с ирисом, пачули и ванилью. Олицетворение счастья и радости.',
    price: 10200,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 75,
    category: 'Eau de Parfum',
    stock_quantity: 10
  },
  {
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    description: 'Универсальный мужской аромат с цитрусовыми нотами и древесными аккордами. Для современного мужчины.',
    price: 11000,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 14
  },
  {
    name: 'J\'adore',
    brand: 'Dior',
    description: 'Роскошный цветочный женский аромат с нотами иланг-иланга, розы и жасмина. Фемининный и элегантный.',
    price: 13500,
    image_url: 'https://images.unsplash.com/photo-1547887535-2c0d234b5c1a?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 8
  },
  {
    name: 'One Million',
    brand: 'Paco Rabanne',
    description: 'Смелый мужской аромат с нотами кожи, мускуса и амбры. Для тех, кто любит быть в центре внимания.',
    price: 8200,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 16
  },
  {
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    description: 'Соблазнительный женский аромат с туберозой, жасмином и какао. Элегантный и дерзкий.',
    price: 11500,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 80,
    category: 'Eau de Parfum',
    stock_quantity: 11
  },
  {
    name: 'Invictus',
    brand: 'Paco Rabanne',
    description: 'Энергичный мужской аромат с морскими и фруктовыми нотами. Для победителей по жизни.',
    price: 7600,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 22
  },
  {
    name: 'Flowerbomb',
    brand: 'Viktor&Rolf',
    description: 'Взрыв цветочных нот с пачули и ванилью. Яркий и запоминающийся женский аромат.',
    price: 9800,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 90,
    category: 'Eau de Parfum',
    stock_quantity: 13
  },
  {
    name: 'Boss Bottled',
    brand: 'Hugo Boss',
    description: 'Классический мужской аромат с яблочными и древесными нотами. Для успешных деловых мужчин.',
    price: 7200,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 19
  },
  {
    name: 'Light Blue',
    brand: 'Dolce&Gabbana',
    description: 'Свежий и легкий унисекс аромат с цитрусовыми и мускусными нотами. Идеален для повседневности.',
    price: 8500,
    image_url: 'https://images.unsplash.com/photo-1547887535-2c0d234b5c1a?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 17
  },
  {
    name: 'Angel',
    brand: 'Mugler',
    description: 'Инновационный женский аромат с нотами пачули, карамели и шоколада. Уникальный и смелый.',
    price: 10800,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 9
  },
  {
    name: 'Le Male',
    brand: 'Jean Paul Gaultier',
    description: 'Знаковый мужской аромат с ванилью и мятой. Сексуальный и незабываемый.',
    price: 7900,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 125,
    category: 'Eau de Toilette',
    stock_quantity: 21
  },
  {
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    description: 'Молодой и современный аромат с пачули и бергамотом. Для уверенных в себе женщин.',
    price: 11800,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 12
  },
  {
    name: 'Armani Code',
    brand: 'Giorgio Armani',
    description: 'Чувственный мужской аромат с нотами табака и кожи. Загадочный и притягательный.',
    price: 8300,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 110,
    category: 'Eau de Toilette',
    stock_quantity: 15
  },
  {
    name: 'Idôle',
    brand: 'Lancôme',
    description: 'Современный женский аромат с розами и жасмином. Вдохновляет на свершения.',
    price: 9400,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 75,
    category: 'Eau de Parfum',
    stock_quantity: 14
  },
  {
    name: 'Eros',
    brand: 'Versace',
    description: 'Страстный мужской аромат с мятой и ванилью. Для романтических натур.',
    price: 7700,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 18
  },
  {
    name: 'My Way',
    brand: 'Giorgio Armani',
    description: 'Цветочный женский аромат с туберозой и бергамотом. О путешествиях и открытиях.',
    price: 10100,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 90,
    category: 'Eau de Parfum',
    stock_quantity: 11
  },
  {
    name: 'Spicebomb',
    brand: 'Viktor&Rolf',
    description: 'Пряный мужской аромат с перцем и табаком. Смелый и темпераментный.',
    price: 8900,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 90,
    category: 'Eau de Toilette',
    stock_quantity: 16
  },
  {
    name: 'Libre',
    brand: 'Yves Saint Laurent',
    description: 'Бесподобный женский аромат с лавандой и ванилью. О свободе и самовыражении.',
    price: 11200,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 90,
    category: 'Eau de Parfum',
    stock_quantity: 10
  },
  {
    name: 'Allure Homme',
    brand: 'Chanel',
    description: 'Утонченный мужской аромат с нотами мандарина и ветивера. Для истинных ценителей.',
    price: 12400,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 13
  },
  {
    name: 'Miss Dior',
    brand: 'Dior',
    description: 'Романтический женский аромат с пачули и гальбанумом. Нежный и изысканный.',
    price: 9600,
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Parfum',
    stock_quantity: 15
  },
  {
    name: 'Terre d\'Hermès',
    brand: 'Hermès',
    description: 'Землистый мужской аромат с апельсином и ветивером. Утонченный и элегантный.',
    price: 13200,
    image_url: 'https://images.unsplash.com/photo-1590736968-e0acaea6cee4?w=400&h=400&fit=crop',
    volume_ml: 100,
    category: 'Eau de Toilette',
    stock_quantity: 8
  }
];

console.log('Seeding products...');

sampleProducts.forEach((product, index) => {
  db.run(
    `INSERT OR IGNORE INTO products (name, brand, description, price, image_url, volume_ml, category, stock_quantity) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.name,
      product.brand,
      product.description,
      product.price,
      product.image_url,
      product.volume_ml,
      product.category,
      product.stock_quantity
    ],
    function(err) {
      if (err) {
        console.error('Error inserting product:', err);
      } else {
        if (this.changes > 0) {
          console.log(`Added product: ${product.name}`);
        }
      }

      if (index === sampleProducts.length - 1) {
        console.log(`Products seeding completed! Added ${sampleProducts.length} products.`);
        db.close();
      }
    }
  );
});