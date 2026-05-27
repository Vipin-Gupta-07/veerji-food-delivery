#!/usr/bin/env node
/**
 * Veer Ji Malai Chaap Wale — Database Seed Script
 * Run: npm run seed
 * Requires: MONGODB_URI in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local');
  process.exit(1);
}

// ============================================================
// SCHEMAS
// ============================================================

const RestaurantSchema = new mongoose.Schema({
  name: String, description: String, address: String, city: String,
  phone: String, email: String, rating: Number, totalRatings: String,
  deliveryTime: String, minOrder: Number, deliveryFee: Number,
  cuisines: [String], isVeg: Boolean, isOpen: Boolean,
  images: { banner: String, logo: String },
  offers: [{ code: String, description: String, minOrder: Number }],
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, icon: String, sortOrder: Number, isActive: Boolean,
}, { timestamps: true });

const MenuItemSchema = new mongoose.Schema({
  name: String, description: String, price: Number, originalPrice: Number,
  category: String, isVeg: Boolean, isBestseller: Boolean, isAvailable: Boolean,
  rating: Number, calories: Number, prepTime: String, image: String,
  tags: [String], hasCustomization: Boolean,
  customizations: [{ name: String, options: [String] }],
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String, phone: String, role: String,
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Category = mongoose.model('Category', CategorySchema);
const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
const User = mongoose.model('User', UserSchema);

// ============================================================
// SEED DATA
// ============================================================

const RESTAURANT = {
  name: "Veer Ji Malai Chaap Wale",
  description: "Noida's most loved destination for authentic Malai Chaap & North Indian vegetarian delicacies. Serving the finest soy chaap preparations since 2010.",
  address: "F Block Market, Sector 55, Noida, Uttar Pradesh 201301",
  city: "Noida",
  phone: "+91-9876543210",
  email: "contact@veerjichaap.com",
  rating: 4.3,
  totalRatings: "10K+",
  deliveryTime: "25-35 mins",
  minOrder: 149,
  deliveryFee: 30,
  cuisines: ["North Indian", "Chaap", "Vegetarian", "Tandoor"],
  isVeg: true,
  isOpen: true,
  images: {
    banner: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80",
  },
  offers: [
    { code: "VEERJI50", description: "50% off up to ₹100 on first order", minOrder: 199 },
    { code: "FLAT30", description: "Flat ₹30 off on orders above ₹299", minOrder: 299 },
    { code: "FREEDELIVERY", description: "Free delivery on orders above ₹399", minOrder: 399 },
  ],
};

const CATEGORIES = [
  { name: "Bestsellers", slug: "bestsellers", icon: "🏆", sortOrder: 1, isActive: true },
  { name: "Malai Chaap", slug: "malai-chaap", icon: "🍢", sortOrder: 2, isActive: true },
  { name: "Tandoori Chaap", slug: "tandoori-chaap", icon: "🔥", sortOrder: 3, isActive: true },
  { name: "Seekh & Tikka", slug: "seekh-tikka", icon: "🥩", sortOrder: 4, isActive: true },
  { name: "Chaap Specials", slug: "chaap-specials", icon: "⭐", sortOrder: 5, isActive: true },
  { name: "Rice & Biryani", slug: "rice-biryani", icon: "🍚", sortOrder: 6, isActive: true },
  { name: "Breads", slug: "breads", icon: "🫓", sortOrder: 7, isActive: true },
  { name: "Combos & Thalis", slug: "combos-thalis", icon: "🍱", sortOrder: 8, isActive: true },
  { name: "Beverages", slug: "beverages", icon: "🥛", sortOrder: 9, isActive: true },
];

const MENU_ITEMS = [
  {
    name: "Malai Chaap (4 Pcs)", category: "bestsellers",
    description: "Tender soy chaap marinated in rich malai & aromatic spices, slow-cooked to perfection.",
    price: 269, originalPrice: 299, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.5, calories: 420, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    tags: ["spicy", "creamy"], hasCustomization: true,
    customizations: [{ name: "Spice Level", options: ["Mild", "Medium", "Spicy", "Extra Spicy"] }],
  },
  {
    name: "Tandoori Chaap (4 Pcs)", category: "bestsellers",
    description: "Classic chaap marinated in tandoori masala, char-grilled in clay oven for authentic smoky flavor.",
    price: 279, originalPrice: 319, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.4, calories: 380, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80",
    tags: ["smoky", "tandoor"], hasCustomization: false, customizations: [],
  },
  {
    name: "Chaap Thali (Premium)", category: "bestsellers",
    description: "4 Malai Chaap + 2 Butter Naan + Dal Makhani + Salad + Raita + Sweet. Best value meal!",
    price: 349, originalPrice: 429, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.6, calories: 780, prepTime: "20-25 mins",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
    tags: ["complete meal", "value"], hasCustomization: false, customizations: [],
  },
  {
    name: "Malai Chaap (2 Pcs)", category: "malai-chaap",
    description: "Soft soy chaap coated with silky malai cream and mild spices.",
    price: 149, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.3, calories: 210, prepTime: "10-15 mins",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    tags: ["creamy", "mild"], hasCustomization: false, customizations: [],
  },
  {
    name: "Afghani Malai Chaap (4 Pcs)", category: "malai-chaap",
    description: "Premium chaap in Afghani-style cream and cashew marinade.",
    price: 319, originalPrice: 369, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.4, calories: 460, prepTime: "20-25 mins",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
    tags: ["afghani", "premium"], hasCustomization: false, customizations: [],
  },
  {
    name: "Haryali Malai Chaap (4 Pcs)", category: "malai-chaap",
    description: "Green herb-marinated chaap with fresh coriander, mint and green chili.",
    price: 289, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.2, calories: 400, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80",
    tags: ["haryali", "herby"], hasCustomization: false, customizations: [],
  },
  {
    name: "Tandoori Chaap (2 Pcs)", category: "tandoori-chaap",
    description: "Marinated in tandoori masala, char-grilled in clay oven. Served with green chutney & onion rings.",
    price: 159, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.3, calories: 190, prepTime: "10-15 mins",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80",
    tags: ["smoky", "classic"], hasCustomization: false, customizations: [],
  },
  {
    name: "Spicy Achari Chaap (4 Pcs)", category: "tandoori-chaap",
    description: "Tangy pickle-spiced chaap with a punchy achari marinade.",
    price: 299, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.1, calories: 370, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    tags: ["spicy", "achari", "tangy"], hasCustomization: false, customizations: [],
  },
  {
    name: "Paneer Tikka (8 Pcs)", category: "seekh-tikka",
    description: "Cubes of fresh cottage cheese marinated in yogurt and spices, grilled to golden perfection.",
    price: 249, originalPrice: 289, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.5, calories: 420, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
    tags: ["paneer", "tikka"], hasCustomization: false, customizations: [],
  },
  {
    name: "Veg Seekh Kebab (4 Pcs)", category: "seekh-tikka",
    description: "Hand-kneaded spiced vegetable seekh kebabs, cooked on iron skewers.",
    price: 199, originalPrice: 229, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.2, calories: 310, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80",
    tags: ["kebab", "grilled"], hasCustomization: false, customizations: [],
  },
  {
    name: "Chaap Butter Masala", category: "chaap-specials",
    description: "Veer Ji's special creamy butter masala with chaap — ultimate North Indian comfort food.",
    price: 279, originalPrice: 309, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.6, calories: 520, prepTime: "20-25 mins",
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=500&q=80",
    tags: ["butter masala", "creamy", "rich"], hasCustomization: false, customizations: [],
  },
  {
    name: "Chaap Biryani", category: "rice-biryani",
    description: "Fragrant basmati rice layered with spiced chaap, saffron, and fresh herbs.",
    price: 249, originalPrice: 289, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.4, calories: 680, prepTime: "25-30 mins",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96e?w=500&q=80",
    tags: ["biryani", "rice", "filling"], hasCustomization: false, customizations: [],
  },
  {
    name: "Jeera Rice", category: "rice-biryani",
    description: "Fluffy basmati rice tempered with cumin seeds, clarified butter and whole spices.",
    price: 129, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.0, calories: 340, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80",
    tags: ["rice", "jeera"], hasCustomization: false, customizations: [],
  },
  {
    name: "Garlic Naan", category: "breads",
    description: "Classic naan topped with minced garlic, butter and fresh coriander leaves.",
    price: 59, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.5, calories: 190, prepTime: "8-10 mins",
    image: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=500&q=80",
    tags: ["naan", "garlic", "bread"], hasCustomization: false, customizations: [],
  },
  {
    name: "Butter Naan", category: "breads",
    description: "Soft, pillowy naan bread baked in tandoor and generously brushed with real butter.",
    price: 49, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.3, calories: 180, prepTime: "8-10 mins",
    image: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=500&q=80",
    tags: ["naan", "bread"], hasCustomization: false, customizations: [],
  },
  {
    name: "Tandoori Roti", category: "breads",
    description: "Whole wheat roti cooked in tandoor. Healthy, fluffy and perfect with any gravy.",
    price: 35, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.1, calories: 140, prepTime: "5-8 mins",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80",
    tags: ["roti", "healthy"], hasCustomization: false, customizations: [],
  },
  {
    name: "Chaap Thali (Premium)", category: "combos-thalis",
    description: "4 Malai Chaap + 2 Butter Naan + Dal Makhani + Salad + Raita + Gulab Jamun",
    price: 349, originalPrice: 429, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.6, calories: 780, prepTime: "20-25 mins",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
    tags: ["complete meal", "value", "thali"], hasCustomization: false, customizations: [],
  },
  {
    name: "Solo Meal Box", category: "combos-thalis",
    description: "2 Malai Chaap + 1 Butter Naan + Dal Fry + Salad. Perfect for one.",
    price: 199, originalPrice: 249, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.3, calories: 520, prepTime: "15-20 mins",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
    tags: ["solo", "meal", "combo"], hasCustomization: false, customizations: [],
  },
  {
    name: "Mango Lassi", category: "beverages",
    description: "Seasonal Alphonso mango blended with thick yogurt and a touch of cream.",
    price: 119, isVeg: true, isBestseller: true, isAvailable: true,
    rating: 4.6, calories: 280, prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1598315893369-ddfb892b8f5f?w=500&q=80",
    tags: ["mango", "lassi", "cold"], hasCustomization: false, customizations: [],
  },
  {
    name: "Sweet Lassi", category: "beverages",
    description: "Thick, creamy yogurt drink whipped with sugar and a hint of cardamom.",
    price: 89, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.4, calories: 220, prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
    tags: ["lassi", "cold", "sweet"], hasCustomization: false, customizations: [],
  },
  {
    name: "Masala Chaas", category: "beverages",
    description: "Spiced buttermilk with roasted cumin, black salt, mint and ginger.",
    price: 69, isVeg: true, isBestseller: false, isAvailable: true,
    rating: 4.2, calories: 80, prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
    tags: ["chaas", "digestive"], hasCustomization: false, customizations: [],
  },
];

const DEMO_USERS = [
  { name: "Admin User", email: "admin@veerji.com", password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFfxWFCbGAr5aCe", role: "admin" }, // Admin@123456
  { name: "Demo User", email: "user@veerji.com", password: "$2a$12$OcuVXOCK3SdI7u7nJvZr3.pX4H5kPy1OGWd2k9cH5.YzpEhwn7h9u", role: "user" },   // User@123456
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed() {
  console.log('🌱 Starting seed...\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // Seed
    const restaurant = await Restaurant.create(RESTAURANT);
    console.log(`✅ Restaurant: ${restaurant.name}`);

    const categories = await Category.insertMany(CATEGORIES);
    console.log(`✅ Categories: ${categories.length} seeded`);

    const menuItems = await MenuItem.insertMany(MENU_ITEMS);
    console.log(`✅ Menu Items: ${menuItems.length} seeded`);

    const users = await User.insertMany(DEMO_USERS);
    console.log(`✅ Users: ${users.length} seeded`);

    console.log('\n🎉 Seed complete!\n');
    console.log('Demo accounts:');
    console.log('  Admin: admin@veerji.com / Admin@123456');
    console.log('  User:  user@veerji.com / User@123456');
    console.log('\nStart dev server: npm run dev\n');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
