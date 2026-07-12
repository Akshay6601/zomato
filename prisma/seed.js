require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.foodItem.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating default test user...');
  const hashedPassword = bcrypt.hashSync('Password123', 10);
  const testUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@example.com',
      password: hashedPassword,
    },
  });
  console.log(`Test user created: ${testUser.email}`);

  console.log('Creating reviewer users pool...');
  const reviewerNames = ['Alice', 'Bob', 'Charlie', 'David'];
  const reviewers = [];
  for (const name of reviewerNames) {
    const reviewer = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase()}@example.com`,
        password: hashedPassword,
      },
    });
    reviewers.push(reviewer);
  }
  console.log(`Created reviewer pool of size ${reviewers.length}`);

  console.log('Creating categories...');
  const categoryData = [
    { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60' },
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'North Indian', image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=500&auto=format&fit=crop&q=60' },
    { name: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60' },
    { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60' },
    { name: 'Healthy & Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
    { name: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const createdCat = await prisma.category.create({ data: cat });
    categories[cat.name] = createdCat;
  }
  console.log(`Created ${Object.keys(categories).length} categories.`);

  console.log('Creating restaurants and food items...');
  const restaurantsData = [
    {
      name: 'The Biryani Project',
      description: 'Authentic royal dum biryanis cooked to perfection with select spices.',
      bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Biryani, Mughlai, North Indian',
      rating: 4.6,
      deliveryTime: 35,
      deliveryFee: 29,
      distance: 2.4,
      priceRange: '₹300 for one',
      menu: [
        { name: 'Hyderabadi Chicken Biryani', price: 299, isVeg: false, categoryName: 'Biryani', description: 'Fragrant basmati rice layered with juicy chicken marinated in traditional spices.', rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Royal Paneer Biryani', price: 249, isVeg: true, categoryName: 'Biryani', description: 'Fresh cottage cheese cubes cooked in spicy gravy and layered with aromatic basmati rice.', rating: 4.5, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Lucknowi Mutton Biryani', price: 399, isVeg: false, categoryName: 'Biryani', description: 'Awadhi style slow-cooked goat meat layered with saffron infused premium basmati rice.', rating: 4.9, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80' },
        { name: 'Egg Dum Biryani', price: 219, isVeg: false, categoryName: 'Biryani', description: 'Spiced boiled eggs cooked inside layers of fragrant long grain basmati rice.', rating: 4.4, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Veg Dum Biryani', price: 209, isVeg: true, categoryName: 'Biryani', description: 'Assorted seasonal vegetables dum-cooked with long grain rice and mint.', rating: 4.3, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Tikka Kabab', price: 279, isVeg: false, categoryName: 'North Indian', description: 'Boneless chicken cubes marinated in yogurt and tandoori spices, grilled in a clay oven.', rating: 4.7, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80' },
        { name: 'Paneer Tikka Kabab', price: 239, isVeg: true, categoryName: 'North Indian', description: 'Cottage cheese chunks skewered with bell peppers and onions, roasted in tandoor.', rating: 4.6, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Butter Chicken Curry', price: 329, isVeg: false, categoryName: 'North Indian', description: 'Tandoori chicken tikkas simmered in a rich, buttery, tomato-based gravy.', rating: 4.8, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80' },
        { name: 'Paneer Butter Masala', price: 269, isVeg: true, categoryName: 'North Indian', description: 'Creamy and slightly sweet curry cooked with rich butter and tomatoes.', rating: 4.5, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80' },
        { name: 'Tandoori Roti', price: 29, isVeg: true, categoryName: 'North Indian', description: 'Whole wheat flatbread baked in a tandoor.', rating: 4.2, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&auto=format&fit=crop&q=80' },
        { name: 'Butter Naan', price: 49, isVeg: true, categoryName: 'North Indian', description: 'Soft leavened flatbread topped with butter.', rating: 4.6, image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=80' },
        { name: 'Double Ka Meetha', price: 119, isVeg: true, categoryName: 'Desserts', description: 'Classic bread pudding dessert topped with dry fruits and saffron syrup.', rating: 4.7, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
        { name: 'Phirni', price: 99, isVeg: true, categoryName: 'Desserts', description: 'Creamy pudding made of ground rice, milk, and cardamom served in clay pots.', rating: 4.6, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mango Lassi', price: 79, isVeg: true, categoryName: 'Beverages', description: 'Thick, creamy yogurt drink blended with sweet mango pulp.', rating: 4.8, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spiced Jaljeera', price: 49, isVeg: true, categoryName: 'Beverages', description: 'Refreshing Indian summer drink with cumin, mint, and lemon juice.', rating: 4.1, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Pizzeria Bella',
      description: 'Wood-fired artisanal pizzas made with San Marzano tomatoes and fresh mozzarella.',
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Italian, Pizza, Fast Food',
      rating: 4.5,
      deliveryTime: 25,
      deliveryFee: 19,
      distance: 1.8,
      priceRange: '₹400 for one',
      menu: [
        { name: 'Classic Margherita Pizza', price: 349, isVeg: true, categoryName: 'Pizza', description: 'San Marzano tomatoes, fresh mozzarella, fresh basil, and extra virgin olive oil.', rating: 4.7, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80' },
        { name: 'Double Cheese Margherita', price: 399, isVeg: true, categoryName: 'Pizza', description: 'Classic Margherita loaded with an extra layer of liquid mozzarella cheese.', rating: 4.6, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80' },
        { name: 'Farmhouse Pizza', price: 449, isVeg: true, categoryName: 'Pizza', description: 'Delightful combination of onions, capsicum, tomatoes, and mushrooms.', rating: 4.5, image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spicy Pepperoni Pizza', price: 549, isVeg: false, categoryName: 'Pizza', description: 'Classic Italian pepperoni with fresh marinara sauce and lots of mozzarella cheese.', rating: 4.9, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fiery Chicken Pizza', price: 499, isVeg: false, categoryName: 'Pizza', description: 'Spicy hot chicken chunks, onions, red paprika, and green chilies.', rating: 4.7, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80' },
        { name: 'Garlic Breadsticks', price: 149, isVeg: true, categoryName: 'Pizza', description: 'Baked dough sticks brushed with garlic butter and herbs, served with cheesy dip.', rating: 4.4, image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&auto=format&fit=crop&q=80' },
        { name: 'Stuffed Garlic Bread', price: 199, isVeg: true, categoryName: 'Pizza', description: 'Filled with sweet corn, jalapenos, and gooey mozzarella cheese.', rating: 4.6, image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&auto=format&fit=crop&q=80' },
        { name: 'Penne Arrabbiata Pasta', price: 299, isVeg: true, categoryName: 'Healthy & Salads', description: 'Penne cooked in a spicy, fiery red tomato sauce infused with garlic and chili flakes.', rating: 4.3, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Creamy Alfredo Pasta', price: 329, isVeg: true, categoryName: 'Healthy & Salads', description: 'Rich parmesan cheese cream sauce served over hot fettuccine/penne.', rating: 4.5, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&auto=format&fit=crop&q=80' },
        { name: 'Italian Caesar Salad', price: 249, isVeg: true, categoryName: 'Healthy & Salads', description: 'Crisp romaine lettuce, croutons, shaved parmesan cheese with caesar dressing.', rating: 4.2, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chocolate Lava Cake', price: 119, isVeg: true, categoryName: 'Desserts', description: 'Decadent chocolate cake with a molten, warm chocolate center.', rating: 4.8, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' },
        { name: 'Tiramisu Cup', price: 179, isVeg: true, categoryName: 'Desserts', description: 'Traditional Italian dessert layered with coffee-soaked ladyfingers and mascarpone.', rating: 4.8, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80' },
        { name: 'Iced Peach Tea', price: 99, isVeg: true, categoryName: 'Beverages', description: 'Freshly brewed black tea flavored with sweet peach syrup and ice.', rating: 4.4, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80' },
        { name: 'Coca Cola Can', price: 59, isVeg: true, categoryName: 'Beverages', description: 'Chilled 300ml classic soft drink.', rating: 4.5, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mineral Water Bottle', price: 29, isVeg: true, categoryName: 'Beverages', description: 'Chilled packaged drinking water.', rating: 4.3, image: 'https://images.unsplash.com/photo-1608885898957-a599fb18de33?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Burger Craft',
      description: 'Gourmet smashed beef and chicken burgers with customized house sauces.',
      bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Burgers, Fast Food, American',
      rating: 4.4,
      deliveryTime: 20,
      deliveryFee: 39,
      distance: 1.2,
      priceRange: '₹250 for one',
      menu: [
        { name: 'Classic Veg Burger', price: 129, isVeg: true, categoryName: 'Burgers', description: 'Crispy mix vegetable patty with lettuce, tomatoes, and mayonnaise.', rating: 4.2, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80' },
        { name: 'Aloo Tikki Supreme Burger', price: 99, isVeg: true, categoryName: 'Burgers', description: 'Spiced potato patty with sweet tomato sauce and crisp onions.', rating: 4.1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cheese Burst Veg Burger', price: 189, isVeg: true, categoryName: 'Burgers', description: 'Filled with liquid cheddar cheese that oozes with every bite.', rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Classic Crispy Chicken Burger', price: 179, isVeg: false, categoryName: 'Burgers', description: 'Deep fried crispy chicken breast topped with standard mayo and pickles.', rating: 4.6, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&auto=format&fit=crop&q=80' },
        { name: 'The Craft Double Cheeseburger', price: 269, isVeg: false, categoryName: 'Burgers', description: 'Double grilled chicken/beef patties, double cheddar slice, caramelized onions.', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spicy Zinger Chicken Burger', price: 199, isVeg: false, categoryName: 'Burgers', description: 'Crunchy spicy chicken breast fillet with hot chili sauce and fresh lettuce.', rating: 4.7, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Classic French Fries (M)', price: 99, isVeg: true, categoryName: 'Burgers', description: 'Crisp golden salted potato fingers.', rating: 4.3, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80' },
        { name: 'Peri Peri Spiced Fries', price: 119, isVeg: true, categoryName: 'Burgers', description: 'Golden fries tossed in spicy peri peri seasoning.', rating: 4.5, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cheesy Loaded Fries', price: 159, isVeg: true, categoryName: 'Burgers', description: 'Hot fries smothered in warm cheese sauce, jalapenos, and spring onions.', rating: 4.6, image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fried Chicken Wings (6 Pcs)', price: 219, isVeg: false, categoryName: 'Burgers', description: 'Tender chicken wings tossed in hickory smoked BBQ sauce.', rating: 4.7, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Nuggets (9 Pcs)', price: 169, isVeg: false, categoryName: 'Burgers', description: 'Bite-sized breaded chicken breast snacks fried golden.', rating: 4.4, image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chocolate Milkshake', price: 129, isVeg: true, categoryName: 'Beverages', description: 'Thick shake made with rich chocolate ice cream and fresh milk.', rating: 4.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80' },
        { name: 'Oreo Fudge Milkshake', price: 149, isVeg: true, categoryName: 'Beverages', description: 'Vanilla ice cream blended with Oreo cookies and chocolate syrup.', rating: 4.7, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fizzy Lemonade', price: 89, isVeg: true, categoryName: 'Beverages', description: 'Tangy fresh lime soda sweetened to perfection.', rating: 4.3, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Choco Chip Cookie', price: 59, isVeg: true, categoryName: 'Desserts', description: 'Baked cookie loaded with dark chocolate chips.', rating: 4.4, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Spice Symphony',
      description: 'Classic North Indian fine dining at home. Exquisite paneer and tandoori specials.',
      bannerImage: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=150&auto=format&fit=crop&q=80',
      cuisine: 'North Indian, Mughlai, Curry',
      rating: 4.5,
      deliveryTime: 40,
      deliveryFee: 49,
      distance: 3.5,
      priceRange: '₹350 for one',
      menu: [
        { name: 'Kadhai Paneer', price: 279, isVeg: true, categoryName: 'North Indian', description: 'Cottage cheese and bell peppers cooked in a spicy, freshly ground spice paste.', rating: 4.6, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80' },
        { name: 'Dal Makhani', price: 239, isVeg: true, categoryName: 'North Indian', description: 'Black lentils slow cooked overnight with butter, cream, and aromatic spices.', rating: 4.8, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Malai Kofta', price: 289, isVeg: true, categoryName: 'North Indian', description: 'Fried paneer and potato dumplings in a rich, sweet, and creamy cashew gravy.', rating: 4.7, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80' },
        { name: 'Kadhai Chicken', price: 339, isVeg: false, categoryName: 'North Indian', description: 'Chicken cooked in a traditional iron wok with fresh ginger, garlic, and coriander.', rating: 4.6, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80' },
        { name: 'Murg Musallam', price: 389, isVeg: false, categoryName: 'North Indian', description: 'Rich chicken dish cooked in almond paste, yogurt, and flavored with saffron.', rating: 4.7, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=80' },
        { name: 'Veg Pulao', price: 169, isVeg: true, categoryName: 'North Indian', description: 'Fragrant steamed basmati rice tossed with garden fresh peas and carrots.', rating: 4.3, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Garlic Naan', price: 59, isVeg: true, categoryName: 'North Indian', description: 'Clay oven baked bread infused with minced garlic and butter.', rating: 4.7, image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=80' },
        { name: 'Laccha Paratha', price: 49, isVeg: true, categoryName: 'North Indian', description: 'Multi-layered flaky whole wheat bread baked in tandoor.', rating: 4.5, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&auto=format&fit=crop&q=80' },
        { name: 'Veg Seekh Kabab', price: 219, isVeg: true, categoryName: 'North Indian', description: 'Minced veggies mixed with spices, skewered and tandoored.', rating: 4.4, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Gulab Jamun (2 Pcs)', price: 69, isVeg: true, categoryName: 'Desserts', description: 'Warm golden deep fried flour dumplings soaked in rose flavored sugar syrup.', rating: 4.8, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
        { name: 'Rasmalai (2 Pcs)', price: 89, isVeg: true, categoryName: 'Desserts', description: 'Soft paneer discs soaked in sweet, cardamom flavored thickened milk.', rating: 4.9, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
        { name: 'Salted Lassi', price: 69, isVeg: true, categoryName: 'Beverages', description: 'Chilled churned yogurt drink seasoned with roasted cumin and salt.', rating: 4.3, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Masala Chaas', price: 49, isVeg: true, categoryName: 'Beverages', description: 'Light buttermilk flavored with mint, coriander, and green chilies.', rating: 4.4, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spiced Thandai', price: 89, isVeg: true, categoryName: 'Beverages', description: 'Sweet milk beverage infused with almond, fennel seeds, and rose petals.', rating: 4.6, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Jeera Rice', price: 139, isVeg: true, categoryName: 'North Indian', description: 'Long grain rice tempered with roasted cumin seeds and fresh ghee.', rating: 4.4, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Golden Dragon',
      description: 'Fiery and sweet Indo-Chinese street style items and dim sums.',
      bannerImage: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Chinese, Asian, Fast Food',
      rating: 4.3,
      deliveryTime: 30,
      deliveryFee: 29,
      distance: 2.8,
      priceRange: '₹250 for one',
      menu: [
        { name: 'Veg Hakka Noodles', price: 179, isVeg: true, categoryName: 'Chinese', description: 'Stir-fried noodles with crisp julienned vegetables and soy sauce.', rating: 4.5, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Hakka Noodles', price: 219, isVeg: false, categoryName: 'Chinese', description: 'Stir-fried noodles with tender chicken shreds, eggs, and veggies.', rating: 4.6, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80' },
        { name: 'Schezwan Fried Rice Veg', price: 189, isVeg: true, categoryName: 'Chinese', description: 'Spicy rice wok-tossed with our in-house pungent Schezwan chili paste.', rating: 4.4, image: 'https://images.unsplash.com/photo-1603133872878-68550a5e7b64?w=400&auto=format&fit=crop&q=80' },
        { name: 'Schezwan Fried Rice Chicken', price: 229, isVeg: false, categoryName: 'Chinese', description: 'Wok tossed rice loaded with scrambled eggs, shredded chicken, and hot sauce.', rating: 4.7, image: 'https://images.unsplash.com/photo-1603133872878-68550a5e7b64?w=400&auto=format&fit=crop&q=80' },
        { name: 'Veg Manchurian Gravy', price: 199, isVeg: true, categoryName: 'Chinese', description: 'Deep fried veggie balls in a dark, glossy, tangy garlic-soy sauce.', rating: 4.5, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chilli Chicken Dry', price: 249, isVeg: false, categoryName: 'Chinese', description: 'Stir fried battered chicken cubes with capsicum, onion, and dark green chilies.', rating: 4.8, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Steamed Veg Momos (8 Pcs)', price: 129, isVeg: true, categoryName: 'Chinese', description: 'Thin wrapper dough filled with minced vegetables, steamed hot.', rating: 4.3, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Steamed Chicken Momos (8 Pcs)', price: 159, isVeg: false, categoryName: 'Chinese', description: 'Juicy chicken mince stuffed inside soft wrappers, steamed.', rating: 4.6, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Pan Fried Chilli Momos Veg', price: 169, isVeg: true, categoryName: 'Chinese', description: 'Momos pan fried and tossed in hot chili and garlic paste.', rating: 4.5, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spring Rolls (4 Pcs)', price: 139, isVeg: true, categoryName: 'Chinese', description: 'Crispy fried rolls packed with sautéed cabbage, carrots, and glass noodles.', rating: 4.2, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80' },
        { name: 'Hot & Sour Soup Veg', price: 109, isVeg: true, categoryName: 'Chinese', description: 'Spiced soup featuring mushrooms, tofu, and vinegar for a sour kick.', rating: 4.1, image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=400&auto=format&fit=crop&q=80' },
        { name: 'Sweet Corn Soup Chicken', price: 129, isVeg: false, categoryName: 'Chinese', description: 'Creamy, sweet corn kernels simmered in rich egg drop broth with chicken.', rating: 4.4, image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=400&auto=format&fit=crop&q=80' },
        { name: 'Honey Chilli Potato', price: 179, isVeg: true, categoryName: 'Chinese', description: 'Crispy potato fingers tossed in honey, sesame seeds, and light sweet-spicy sauce.', rating: 4.6, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Jasmine Rice', price: 119, isVeg: true, categoryName: 'Chinese', description: 'Fragrant and aromatic long grain steamed rice.', rating: 4.3, image: 'https://images.unsplash.com/photo-1603133872878-68550a5e7b64?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chilled Ice Lemon Tea', price: 79, isVeg: true, categoryName: 'Beverages', description: 'Iced tea flavored with tangy fresh lemon extract.', rating: 4.4, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Sweet Treats',
      description: 'Delectable waffles, ice cream sundaes, and fresh baked cakes.',
      bannerImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Desserts, Bakery',
      rating: 4.7,
      deliveryTime: 25,
      deliveryFee: 19,
      distance: 2.0,
      priceRange: '₹200 for one',
      menu: [
        { name: 'Belgian Chocolate Waffle', price: 159, isVeg: true, categoryName: 'Desserts', description: 'Warm, crispy waffle smothered in premium melted Belgian milk chocolate.', rating: 4.8, image: 'https://images.unsplash.com/photo-1562376502-6f769499c886?w=400&auto=format&fit=crop&q=80' },
        { name: 'Death by Chocolate Sundae', price: 219, isVeg: true, categoryName: 'Desserts', description: 'Layers of chocolate cake, chocolate ice cream, hot fudge, and chocolate chips.', rating: 4.9, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Red Velvet Pastry', price: 99, isVeg: true, categoryName: 'Desserts', description: 'Classic velvety sponge cake layered with sweet cream cheese frosting.', rating: 4.6, image: 'https://images.unsplash.com/photo-1586985289688-ca9cf47d3e6e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Blueberry Cheesecake Slice', price: 189, isVeg: true, categoryName: 'Desserts', description: 'Graham cracker crust with smooth cream cheese, topped with sweet blueberries.', rating: 4.8, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=80' },
        { name: 'Nutella Brownie', price: 129, isVeg: true, categoryName: 'Desserts', description: 'Fudgy chocolate brownie topped with thick Nutella spread.', rating: 4.7, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' },
        { name: 'Warm Apple Pie Slice', price: 149, isVeg: true, categoryName: 'Desserts', description: 'Flaky crust pie loaded with spiced apples, served warm.', rating: 4.5, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&auto=format&fit=crop&q=80' },
        { name: 'Choco Lava sundae', price: 169, isVeg: true, categoryName: 'Desserts', description: 'Warm choco lava cake served with a scoop of premium vanilla ice cream.', rating: 4.7, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chilled Cold Coffee', price: 109, isVeg: true, categoryName: 'Beverages', description: 'Creamy milk blended with instant coffee and vanilla ice cream.', rating: 4.6, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80' },
        { name: 'Milk chocolate cookies', price: 89, isVeg: true, categoryName: 'Desserts', description: 'Crispy cookies with rich milk chocolate drops inside.', rating: 4.3, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chocolaty Milkshake', price: 139, isVeg: true, categoryName: 'Beverages', description: 'Rich chocolate syrup blended with milk and thick cream.', rating: 4.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80' },
        { name: 'Hot Fudge Chocolate', price: 49, isVeg: true, categoryName: 'Desserts', description: 'Warm and rich chocolate sauce topping.', rating: 4.6, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' },
        { name: 'Vanilla Ice Cream Scoop', price: 69, isVeg: true, categoryName: 'Desserts', description: 'One scoop of vanilla ice cream made with real Madagascar vanilla beans.', rating: 4.4, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mango Ice Cream Scoop', price: 79, isVeg: true, categoryName: 'Desserts', description: 'Creamy mango ice cream made with real Alphonso mangoes.', rating: 4.5, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Strawberry Ice Cream Scoop', price: 79, isVeg: true, categoryName: 'Desserts', description: 'Sweet strawberry ice cream with real strawberry fruit chunks.', rating: 4.4, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&auto=format&fit=crop&q=80' },
        { name: 'Hot Espresso Shot', price: 89, isVeg: true, categoryName: 'Beverages', description: 'Single shot of bold, robust dark roast espresso.', rating: 4.3, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'The Cafe Club',
      description: 'Finely brewed coffee, gourmet sandwiches, and light wraps.',
      bannerImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Beverages, Cafe, Fast Food',
      rating: 4.2,
      deliveryTime: 20,
      deliveryFee: 29,
      distance: 1.5,
      priceRange: '₹150 for one',
      menu: [
        { name: 'Cafe Latte', price: 129, isVeg: true, categoryName: 'Beverages', description: 'Espresso shot with steamed milk and a thin layer of foam.', rating: 4.5, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cappuccino', price: 139, isVeg: true, categoryName: 'Beverages', description: 'Balanced espresso, hot milk, and thick milk foam topping.', rating: 4.6, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?w=400&auto=format&fit=crop&q=80' },
        { name: 'Caramel Macchiato', price: 159, isVeg: true, categoryName: 'Beverages', description: 'Espresso with vanilla syrup, milk, and sweet caramel drizzle.', rating: 4.8, image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?w=400&auto=format&fit=crop&q=80' },
        { name: 'Classic Cold Brew', price: 119, isVeg: true, categoryName: 'Beverages', description: 'Smooth, 18-hour slow steeped black coffee served iced.', rating: 4.4, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80' },
        { name: 'Grilled Cheese Sandwich', price: 149, isVeg: true, categoryName: 'Healthy & Salads', description: 'Crisp butter-toasted bread stuffed with cheddar and mozzarella.', rating: 4.3, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80' },
        { name: 'Paneer Tikka Sandwich', price: 179, isVeg: true, categoryName: 'Healthy & Salads', description: 'Spiced tandoori paneer stuffing grilled in soft sourdough bread.', rating: 4.6, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Junglee Sandwich', price: 199, isVeg: false, categoryName: 'Healthy & Salads', description: 'Shredded chicken mixed with spicy mayo, celery, and fresh herbs.', rating: 4.7, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80' },
        { name: 'Blueberry Muffin', price: 89, isVeg: true, categoryName: 'Desserts', description: 'Soft, moist cake muffin loaded with wild sweet blueberries.', rating: 4.4, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=80' },
        { name: 'Choco Almond Brownie', price: 119, isVeg: true, categoryName: 'Desserts', description: 'Rich fudge brownie loaded with roasted almond flakes.', rating: 4.5, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' },
        { name: 'Banana Walnut Cake Slice', price: 99, isVeg: true, categoryName: 'Desserts', description: 'Fragrant sliced dry cake packed with ripe bananas and walnuts.', rating: 4.6, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80' },
        { name: 'Iced Green Tea', price: 99, isVeg: true, categoryName: 'Beverages', description: 'Refreshing organic unsweetened green tea brewed over ice.', rating: 4.2, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80' },
        { name: 'Hot Chocolate', price: 149, isVeg: true, categoryName: 'Beverages', description: 'Creamy steamed milk blended with rich dark cocoa powder.', rating: 4.7, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Classic English Tea', price: 79, isVeg: true, categoryName: 'Beverages', description: 'Hot tea served with milk and sugar on the side.', rating: 4.3, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Veg Hummus Wrap', price: 169, isVeg: true, categoryName: 'Healthy & Salads', description: 'Hummus, cucumber, carrots, lettuce, and feta wrapped in tortilla.', rating: 4.5, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793fdf?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Caesar Wrap', price: 189, isVeg: false, categoryName: 'Healthy & Salads', description: 'Grilled chicken, crisp romaine, caesar dressing inside a wheat wrap.', rating: 4.6, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793fdf?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Green & Lean',
      description: 'Healthy salads, custom nutrient bowls, and fresh cold-pressed juices.',
      bannerImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Healthy & Salads, Vegetarian',
      rating: 4.6,
      deliveryTime: 25,
      deliveryFee: 19,
      distance: 2.2,
      priceRange: '₹300 for one',
      menu: [
        { name: 'Avocado Quinoa Salad', price: 299, isVeg: true, categoryName: 'Healthy & Salads', description: 'Creamy avocado, boiled quinoa, cherry tomatoes, cucumbers with lemon vinaigrette.', rating: 4.7, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80' },
        { name: 'Greek Feta Salad', price: 249, isVeg: true, categoryName: 'Healthy & Salads', description: 'Tomatoes, cucumbers, red onions, kalamata olives, and a large slab of fresh feta.', rating: 4.5, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80' },
        { name: 'Tofu Buddha Bowl', price: 279, isVeg: true, categoryName: 'Healthy & Salads', description: 'Brown rice, grilled tofu, roasted broccoli, sweet potato, and tahini drizzle.', rating: 4.6, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Paneer Protein Bowl', price: 289, isVeg: true, categoryName: 'Healthy & Salads', description: 'Grilled paneer, chickpea mash, spinach, broccoli, sprouts, mint yogurt dip.', rating: 4.6, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Superfood Salad', price: 329, isVeg: false, categoryName: 'Healthy & Salads', description: 'Grilled chicken breast, kale, cranberries, almonds, avocado, mustard honey sauce.', rating: 4.8, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fruit Salad Bowl', price: 199, isVeg: true, categoryName: 'Healthy & Salads', description: 'Fresh cut apples, pineapples, pomegranates, grapes, and sweet melons.', rating: 4.4, image: 'https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=400&auto=format&fit=crop&q=80' },
        { name: 'Detox Green Juice', price: 129, isVeg: true, categoryName: 'Beverages', description: 'Cold pressed celery, cucumber, green apple, spinach, ginger, and lemon juice.', rating: 4.5, image: 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?w=400&auto=format&fit=crop&q=80' },
        { name: 'Carrot Ginger Boost Juice', price: 119, isVeg: true, categoryName: 'Beverages', description: 'Pure cold pressed carrot, red apple, orange, and fresh ginger.', rating: 4.4, image: 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fresh Orange Juice', price: 139, isVeg: true, categoryName: 'Beverages', description: '100% natural pure orange juice without added sugar or ice.', rating: 4.7, image: 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?w=400&auto=format&fit=crop&q=80' },
        { name: 'Strawberry Banana Smoothie', price: 159, isVeg: true, categoryName: 'Beverages', description: 'Strawberries, bananas, and low-fat greek yogurt blended together.', rating: 4.6, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&auto=format&fit=crop&q=80' },
        { name: 'Berry Antioxidant Smoothie', price: 179, isVeg: true, categoryName: 'Beverages', description: 'Blueberries, strawberries, raspberries blended with almond milk.', rating: 4.7, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&auto=format&fit=crop&q=80' },
        { name: 'Sugar-Free Coconut Water', price: 79, isVeg: true, categoryName: 'Beverages', description: 'Fresh, hydrating tender coconut water bottled directly.', rating: 4.8, image: 'https://images.unsplash.com/photo-1608885898957-a599fb18de33?w=400&auto=format&fit=crop&q=80' },
        { name: 'Boiled Egg Whites (4 Eggs)', price: 99, isVeg: false, categoryName: 'Healthy & Salads', description: 'Slices of clean boiled egg whites seasoned with salt and black pepper.', rating: 4.3, image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop&q=80' },
        { name: 'Roasted Broccoli & Almonds', price: 179, isVeg: true, categoryName: 'Healthy & Salads', description: 'Lightly roasted green broccoli florets tossed with toasted sliced almonds.', rating: 4.4, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80' },
        { name: 'Sugar-Free Dark Chocolate Pudding', price: 129, isVeg: true, categoryName: 'Desserts', description: 'Stevia sweetened rich sugar-free dark chocolate avocado pudding.', rating: 4.2, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'South Spice',
      description: 'Crispy butter dosas, soft idlis, and authentic filter coffee from the South.',
      bannerImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=150&auto=format&fit=crop&q=80',
      cuisine: 'South Indian, Vegetarian',
      rating: 4.5,
      deliveryTime: 30,
      deliveryFee: 29,
      distance: 3.0,
      priceRange: '₹150 for one',
      menu: [
        { name: 'Classic Masala Dosa', price: 119, isVeg: true, categoryName: 'South Indian', description: 'Crispy rice crepe filled with spiced tempered potato mash.', rating: 4.7, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mysore Masala Dosa', price: 139, isVeg: true, categoryName: 'South Indian', description: 'Dosa spread with spicy garlic red chutney before stuffing potato mash.', rating: 4.6, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cheese Butter Masala Dosa', price: 169, isVeg: true, categoryName: 'South Indian', description: 'Crispy dosa loaded with grated cheese, butter, and potato filling.', rating: 4.7, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Onion Rava Dosa', price: 129, isVeg: true, categoryName: 'South Indian', description: 'Crispy, lacy semolina crepe studded with finely chopped raw onions.', rating: 4.4, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Ghee Podi Idli (2 Pcs)', price: 99, isVeg: true, categoryName: 'South Indian', description: 'Soft steamed rice cakes smeared with spicy gun powder and pure ghee.', rating: 4.8, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Steamed Idli Sambar (2 Pcs)', price: 79, isVeg: true, categoryName: 'South Indian', description: 'Traditional fluffy rice cakes served with hot spicy lentil stew.', rating: 4.5, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Medu Vada (2 Pcs)', price: 89, isVeg: true, categoryName: 'South Indian', description: 'Deep fried savory black lentil donut fritters served with coconut chutney.', rating: 4.6, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80' },
        { name: 'Idli Vada Combo', price: 99, isVeg: true, categoryName: 'South Indian', description: 'One soft idli and one crispy medu vada served with hot sambar.', rating: 4.6, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'Rava Upma', price: 89, isVeg: true, categoryName: 'South Indian', description: 'Thick semolina porridge cooked with vegetables, curry leaves, mustard seeds.', rating: 4.2, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80' },
        { name: 'South Indian Tomato Rice', price: 129, isVeg: true, categoryName: 'South Indian', description: 'Rice cooked in a tangy spiced tomato gravy, served with papad.', rating: 4.4, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80' },
        { name: 'Authentic Filter Coffee', price: 59, isVeg: true, categoryName: 'Beverages', description: 'Strong chicory blend milk coffee frothed traditionally in a tumbler.', rating: 4.9, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Buttermilk (Chaas)', price: 49, isVeg: true, categoryName: 'Beverages', description: 'Yogurt drink diluted with cold water, ginger, and curry leaves.', rating: 4.3, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Sweet Kesari Bath', price: 89, isVeg: true, categoryName: 'Desserts', description: 'Traditional sweet made of roasted semolina, sugar, ghee, and cashews.', rating: 4.5, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
        { name: 'Dry Fruit Payasam', price: 99, isVeg: true, categoryName: 'Desserts', description: 'South Indian sweet kheer made of vermicelli, milk, cardamom, and raisins.', rating: 4.7, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chilled Coconut Water', price: 79, isVeg: true, categoryName: 'Beverages', description: 'Sweet refreshing natural tender coconut water.', rating: 4.7, image: 'https://images.unsplash.com/photo-1608885898957-a599fb18de33?w=400&auto=format&fit=crop&q=80' },
      ],
    },
    {
      name: 'Taco Fiesta',
      description: 'Mexican style tacos, stuffed burritos, and cheesy quesadillas.',
      bannerImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1000&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Mexican, Fast Food, Burgers',
      rating: 4.4,
      deliveryTime: 25,
      deliveryFee: 39,
      distance: 3.2,
      priceRange: '₹250 for one',
      menu: [
        { name: 'Veg Soft Shell Tacos (3 Pcs)', price: 199, isVeg: true, categoryName: 'Burgers', description: 'Soft wheat flour tortillas stuffed with refried beans, lettuce, salsa, and cheese.', rating: 4.4, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Crispy Tacos (3 Pcs)', price: 249, isVeg: false, categoryName: 'Burgers', description: 'Crunchy corn shells filled with seasoned grilled chicken, sour cream, and salsa.', rating: 4.7, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cheesy Paneer Burrito', price: 229, isVeg: true, categoryName: 'Burgers', description: 'Tortilla rolled with spicy Mexican rice, grilled paneer, black beans, and cheese.', rating: 4.5, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793fdf?w=400&auto=format&fit=crop&q=80' },
        { name: 'Chicken Loaded Burrito', price: 279, isVeg: false, categoryName: 'Burgers', description: 'Big tortilla wrapped with grilled chicken strips, black beans, rice, and guacamole.', rating: 4.8, image: 'https://images.unsplash.com/photo-1626700051175-6518c4793fdf?w=400&auto=format&fit=crop&q=80' },
        { name: 'Cheese Quesadilla', price: 189, isVeg: true, categoryName: 'Burgers', description: 'Grilled tortilla loaded with melted jack and cheddar cheese, served with salsa.', rating: 4.3, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mexican Nachos with Cheese', price: 149, isVeg: true, categoryName: 'Burgers', description: 'Crunchy corn tortilla chips with warm cheese sauce and jalapeño slices.', rating: 4.5, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Loaded Chicken Nachos', price: 219, isVeg: false, categoryName: 'Burgers', description: 'Tortilla chips covered in grilled chicken, warm cheese, black beans, and salsa.', rating: 4.7, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Spiced Potato Wedges', price: 119, isVeg: true, categoryName: 'Burgers', description: 'Crispy deep fried potato wedges dusted with Mexican chili spices.', rating: 4.2, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80' },
        { name: 'Guacamole & Chips Dip', price: 159, isVeg: true, categoryName: 'Healthy & Salads', description: 'Freshly smashed avocado dip with tomatoes and lime, served with chips.', rating: 4.6, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80' },
        { name: 'Mexican Salad Bowl Veg', price: 219, isVeg: true, categoryName: 'Healthy & Salads', description: 'Lettuce, sweet corn, black beans, salsa, sour cream, and crispy tortilla strips.', rating: 4.4, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80' },
        { name: 'Churros with Chocolate Sauce', price: 129, isVeg: true, categoryName: 'Desserts', description: 'Fried pastry dough sticks rolled in cinnamon sugar, with chocolate dip.', rating: 4.8, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80' },
        { name: 'Classic Mojito', price: 119, isVeg: true, categoryName: 'Beverages', description: 'Refreshing mocktail with fresh lime, mint leaves, sugar syrup, and soda.', rating: 4.6, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80' },
        { name: 'Pineapple Virgin Colada', price: 139, isVeg: true, categoryName: 'Beverages', description: 'Thick, creamy blend of pineapple juice and coconut cream with ice.', rating: 4.5, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80' },
        { name: 'Fanta Can', price: 59, isVeg: true, categoryName: 'Beverages', description: 'Chilled 300ml orange carbonated beverage.', rating: 4.3, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80' },
        { name: 'Salsa Dip Extra', price: 39, isVeg: true, categoryName: 'Burgers', description: 'Tangy tomato and chili onion salsa dip.', rating: 4.2, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop&q=80' },
      ],
    },
  ];

  for (const rData of restaurantsData) {
    const { menu, ...rFields } = rData;
    const createdRestaurant = await prisma.restaurant.create({
      data: rFields,
    });
    console.log(`Created Restaurant: ${createdRestaurant.name}`);

    for (const item of menu) {
      const category = categories[item.categoryName];
      if (!category) {
        throw new Error(`Category ${item.categoryName} not found!`);
      }

      await prisma.foodItem.create({
        data: {
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          description: item.description,
          rating: item.rating,
          image: item.image,
          restaurantId: createdRestaurant.id,
          categoryId: category.id,
        },
      });
    }
    console.log(`  Seeded ${menu.length} food items.`);

    // Seed some dummy reviews for the restaurant
    console.log(`  Seeding reviews...`);
    for (let i = 0; i < 3; i++) {
      const reviewer = reviewers[(i + createdRestaurant.name.charCodeAt(0)) % reviewers.length];
      await prisma.review.create({
        data: {
          userId: reviewer.id,
          restaurantId: createdRestaurant.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 rating
          comment: `Amazing food and great delivery speed. Highly recommend ${createdRestaurant.name}! The packaging was also superb.`,
        }
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
