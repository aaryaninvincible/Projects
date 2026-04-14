export const banners = [
  {
    id: '1',
    image: require('../../assets/images/burger_banner.png'),
    title: '50% Off Burgers',
  },
  {
    id: '2',
    image: require('../../assets/images/pizza_banner.png'),
    title: 'Party Pizza Platter',
  }
];

export const categories = [
  { id: '1', name: 'All Shops', icon: 'storefront' },
  { id: '2', name: 'Snacks', icon: 'fast-food' },
  { id: '3', name: 'Drinks', icon: 'cafe' },
  { id: '4', name: 'Healthy', icon: 'nutrition' },
  { id: '5', name: 'Desserts', icon: 'ice-cream' },
];

export const shops = [
  {
    id: 's1',
    name: 'Nescafe Canteen',
    rating: 4.8,
    reviews: 120,
    time: '10-15 min',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    tags: ['Coffee', 'Snacks', 'Maggi'],
    menu: [
      { id: 'm1', name: 'Cheesy Maggi', price: 60, desc: 'Classic maggi loaded with cheese', veg: true, image: 'https://images.unsplash.com/photo-1612929633738-8fe01f7c8100?w=400&q=80' },
      { id: 'm2', name: 'Cold Coffee', price: 80, desc: 'Thick creamy cold coffee', veg: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80' },
      { id: 'm3', name: 'Hot Mocha', price: 90, desc: 'Rich chocolate coffee', veg: true, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80' }
    ]
  },
  {
    id: 's2',
    name: 'Main Block Cafeteria',
    rating: 4.2,
    reviews: 450,
    time: '20-30 min',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    tags: ['Meals', 'Pizza', 'Drinks'],
    menu: [
      { id: 'm4', name: 'Chicken Burger', price: 120, desc: 'Crispy patty with lettuce & mayo', veg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
      { id: 'm5', name: 'Margherita Pizza', price: 150, desc: 'Classic cheese pizza', veg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
      { id: 'm6', name: 'French Fries', price: 70, desc: 'Salted potato fries', veg: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908581?w=500&q=80' }
    ]
  },
  {
    id: 's3',
    name: 'Juice Master',
    rating: 4.5,
    reviews: 89,
    time: '5-10 min',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
    tags: ['Healthy', 'Juice', 'Snacks'],
    menu: [
      { id: 'm7', name: 'Mixed Fruit Juice', price: 60, desc: 'Freshly squeezed seasonal fruits', veg: true, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80' },
      { id: 'm8', name: 'Oreo Shake', price: 90, desc: 'Thick shake with milk & oreos', veg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80' },
      { id: 'm9', name: 'Protein Salad', price: 110, desc: 'Sprouts, paneer, and veggies', veg: true, image: 'https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c601?w=500&q=80' }
    ]
  },
  {
    id: 's4',
    name: 'Sweet Tooth',
    rating: 4.9,
    reviews: 310,
    time: '10-15 min',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    tags: ['Desserts', 'Ice Cream'],
    menu: [
      { id: 'm10', name: 'Chocolate Brownie', price: 80, desc: 'Warm fudge brownie', veg: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80' },
      { id: 'm11', name: 'Vanilla Sundae', price: 100, desc: 'Ice cream with nuts and syrup', veg: true, image: 'https://images.unsplash.com/photo-1563805042-7684c88e5e8a?w=500&q=80' }
    ]
  }
];
