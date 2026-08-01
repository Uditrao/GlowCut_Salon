const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');
const Service = require('../models/Service');
const Stylist = require('../models/Stylist');
const Package = require('../models/Package');
const PromoCode = require('../models/PromoCode');
const Review = require('../models/Review');
const GalleryItem = require('../models/GalleryItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/glowcut';

const servicesData = [
  // Hair Services
  { name: "Women's Haircut", category: 'Hair', description: 'Precision styling, layer cut or trim by senior stylists', price: 299, durationMinutes: 30, imageUrl: '/assets/images/service-haircut.jpg' },
  { name: "Men's Haircut", category: "Men's", description: 'Modern taper, fade or classic scissor cut + hair wash', price: 149, durationMinutes: 20, imageUrl: '/assets/images/service-mens.jpg' },
  { name: 'Hair Wash + Blowdry', category: 'Hair', description: 'Deep cleansing wash followed by professional blowdry styling', price: 249, durationMinutes: 45, imageUrl: '/assets/images/service-blowdry.jpg' },
  { name: 'Hair Colour (Global)', category: 'Hair', description: 'Rich vibrant color coating for full hair volume', price: 999, durationMinutes: 90, imageUrl: '/assets/images/service-colour.jpg' },
  { name: 'Keratin Treatment', category: 'Hair', description: 'Frizz-free smoothing treatment lasting up to 3 months', price: 2499, durationMinutes: 120, imageUrl: '/assets/images/service-keratin.jpg' },
  { name: 'Hair Spa', category: 'Hair', description: 'Nourishing scalp massage & deep conditioning therapy', price: 599, durationMinutes: 60, imageUrl: '/assets/images/service-spa.jpg' },

  // Skin Services
  { name: 'Basic Facial', category: 'Skin', description: 'Herbal exfoliation, steam, mask & relaxing face massage', price: 499, durationMinutes: 45, imageUrl: '/assets/images/service-facial.jpg' },
  { name: 'De-Tan Treatment', category: 'Skin', description: 'Instant tan removal formula for radiant skin tone', price: 399, durationMinutes: 30, imageUrl: '/assets/images/service-detan.jpg' },
  { name: 'Cleanup', category: 'Skin', description: 'Pore cleansing, blackhead removal & hydration glow pack', price: 299, durationMinutes: 30, imageUrl: '/assets/images/service-cleanup.jpg' },

  // Nail & Other
  { name: 'Manicure', category: 'Nails', description: 'Nail shaping, cuticle care, hand massage & polish', price: 349, durationMinutes: 30, imageUrl: '/assets/images/service-manicure.jpg' },
  { name: 'Pedicure', category: 'Nails', description: 'Soaking scrub, heel repair, massage & nail paint', price: 449, durationMinutes: 45, imageUrl: '/assets/images/service-pedicure.jpg' },
  { name: 'Eyebrow Threading', category: 'Makeup', description: 'Precise brow shaping using sterile cotton thread', price: 49, durationMinutes: 10, imageUrl: '/assets/images/service-threading.jpg' },
  { name: 'Waxing (Arms)', category: 'Skin', description: 'Smooth honey wax hair removal for full arms', price: 199, durationMinutes: 20, imageUrl: '/assets/images/service-waxing.jpg' }
];

const stylistsData = [
  {
    name: 'Ananya Sharma',
    photo: '/assets/images/stylist-1.jpg',
    specializations: ['Bridal Makeup', 'Hair Colour', 'Keratin'],
    experienceYears: 8,
    bio: 'Master artist trained at L’Oréal Paris Academy. Specialist in modern balayage and bridal transformations.',
    rating: 4.9,
    isAvailable: true
  },
  {
    name: 'Rahul Verma',
    photo: '/assets/images/stylist-2.jpg',
    specializations: ["Men's Fade", 'Beard Sculpting', 'Hair Spa'],
    experienceYears: 6,
    bio: 'Precision hair architect known for modern men’s styles and scalp rejuvenation therapy.',
    rating: 4.8,
    isAvailable: true
  },
  {
    name: 'Priya Patel',
    photo: '/assets/images/stylist-3.jpg',
    specializations: ['Skin Facials', 'De-Tan Therapy', 'Bridal Glow'],
    experienceYears: 7,
    bio: 'Certified aesthetician focused on organic skin brightening and soothing stress-relief facials.',
    rating: 4.9,
    isAvailable: true
  },
  {
    name: 'Vikas Singh',
    photo: '/assets/images/stylist-4.jpg',
    specializations: ['Creative Cuts', 'Hair Highlights', 'Blowdry'],
    experienceYears: 5,
    bio: 'Passionate hair stylist passionate about customized face-shape haircuts and textured layers.',
    rating: 4.7,
    isAvailable: true
  },
  {
    name: 'Megha Roy',
    photo: '/assets/images/stylist-5.jpg',
    specializations: ['Nail Art', 'Gel Extensions', 'Pedicure Care'],
    experienceYears: 4,
    bio: 'Nail technician trained in detailed aesthetic nail art design and luxurious foot spa routines.',
    rating: 4.8,
    isAvailable: true
  },
  {
    name: 'Sameer Khan',
    photo: '/assets/images/stylist-6.jpg',
    specializations: ['Global Colour', 'Smoothing', "Men's Styling"],
    experienceYears: 9,
    bio: 'Senior stylist with extensive fashion show experience. Expert in global highlights and hair repair.',
    rating: 4.9,
    isAvailable: true
  }
];

const packagesData = [
  // Combos
  {
    name: 'Bridal Glow Combo',
    type: 'combo',
    description: 'Complete head-to-toe beauty pampering before your special occasion.',
    includedServices: ['Basic Facial', 'Hair Wash + Blowdry', 'Manicure', 'Pedicure'],
    originalPrice: 1646,
    discountedPrice: 1199,
    savingsAmount: 447,
    validityDays: 30,
    badge: 'Save 27%',
    isActive: true
  },
  {
    name: 'Party Ready Combo',
    type: 'combo',
    description: 'Instant glam makeover for weekend parties or family celebrations.',
    includedServices: ["Women's Haircut", 'Blowdry', 'Eyebrow Threading'],
    originalPrice: 597,
    discountedPrice: 449,
    savingsAmount: 148,
    validityDays: 30,
    badge: 'Popular',
    isActive: true
  },
  {
    name: 'Full Body Refresh',
    type: 'combo',
    description: 'Deep skin revitalization and silky smooth arms & feet.',
    includedServices: ['De-Tan Treatment', 'Waxing (Arms)', 'Pedicure'],
    originalPrice: 1047,
    discountedPrice: 799,
    savingsAmount: 248,
    validityDays: 30,
    badge: 'Weekend Deal',
    isActive: true
  },
  {
    name: "Men's Grooming Pack",
    type: 'combo',
    description: 'Complete haircut, skin cleansing and hand care session for gentlemen.',
    includedServices: ["Men's Haircut", 'Basic Facial', 'Manicure'],
    originalPrice: 997,
    discountedPrice: 699,
    savingsAmount: 298,
    validityDays: 30,
    badge: "Men's Special",
    isActive: true
  },

  // Memberships
  {
    name: 'Silver Membership',
    type: 'membership',
    description: 'Perfect for regular salon maintenance.',
    includedServices: ['10% off all services', 'Priority booking window', 'Complimentary consultation'],
    originalPrice: 799,
    discountedPrice: 499,
    savingsAmount: 300,
    validityDays: 30,
    badge: 'Starter',
    isActive: true
  },
  {
    name: 'Gold Membership',
    type: 'membership',
    description: 'Our most popular value plan for beauty enthusiasts.',
    includedServices: ['20% off all services', '1 Free Haircut every month', 'Priority queue placement'],
    originalPrice: 1499,
    discountedPrice: 999,
    savingsAmount: 500,
    validityDays: 30,
    badge: 'Best Value',
    isActive: true
  },
  {
    name: 'Platinum Membership',
    type: 'membership',
    description: 'VIP royal treatment with unlimited VIP perks.',
    includedServices: ['30% off all services', '2 Free Services per month', 'Dedicated stylist', 'Skip the wait queue'],
    originalPrice: 2999,
    discountedPrice: 1999,
    savingsAmount: 1000,
    validityDays: 30,
    badge: 'VIP Elite',
    isActive: true
  }
];

const promoCodesData = [
  {
    code: 'DIWALI20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 500,
    expiryDate: new Date('2026-12-31'),
    maxUsageCount: 200,
    description: '20% OFF on all hair & colour services',
    isActive: true
  },
  {
    code: 'WEEKEND20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 400,
    expiryDate: new Date('2026-12-31'),
    maxUsageCount: 500,
    description: '20% OFF on bookings scheduled for Friday-Sunday',
    isActive: true
  },
  {
    code: 'GLOW100',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 500,
    expiryDate: new Date('2026-12-31'),
    maxUsageCount: 300,
    description: 'Flat ₹100 instant discount on orders above ₹500',
    isActive: true
  },
  {
    code: 'NEWYEAR50',
    discountType: 'flat',
    discountValue: 150,
    minOrderValue: 700,
    expiryDate: new Date('2026-12-31'),
    maxUsageCount: 150,
    description: 'Flat ₹150 OFF on combos & packages',
    isActive: true
  }
];

const reviewsData = [
  {
    customerName: 'Sanjana Malhotra',
    rating: 5,
    comment: 'The Keratin treatment by Ananya completely revived my dull hair! Staff was super polite and hygienic.',
    serviceAvailed: 'Keratin Treatment',
    isApproved: true
  },
  {
    customerName: 'Aman Deep',
    rating: 5,
    comment: 'Rahul is absolute wizard with fade haircuts. Plus the real-time live queue token system saved me an hour!',
    serviceAvailed: "Men's Haircut",
    isApproved: true
  },
  {
    customerName: 'Ritu Sharma',
    rating: 5,
    comment: 'Bridal Glow combo was worth every rupee. The facial left my skin glowing for days!',
    serviceAvailed: 'Bridal Glow Combo',
    isApproved: true
  },
  {
    customerName: 'Kavita Saxena',
    rating: 4,
    comment: 'Very clean salon with lovely aesthetic ambiance. Pedicure massage was super relaxing.',
    serviceAvailed: 'Pedicure',
    isApproved: true
  },
  {
    customerName: 'Rohit Gupta',
    rating: 5,
    comment: 'Great ambience, no hidden fees, and seamless online booking. GlowCut is my go-to salon now.',
    serviceAvailed: "Men's Grooming Pack",
    isApproved: true
  }
];

const galleryData = [
  {
    imageUrl: '/assets/images/gallery-1.jpg',
    caption: 'Sun-kissed Balayage & Layers transformation',
    category: 'Hair Colour',
    stylistName: 'Ananya Sharma',
    serviceName: 'Hair Colour (Global)',
    uploadedByAdmin: true,
    isApproved: true
  },
  {
    imageUrl: '/assets/images/gallery-2.jpg',
    caption: 'Classic sharp taper fade with structured beard alignment',
    category: 'Haircuts',
    stylistName: 'Rahul Verma',
    serviceName: "Men's Haircut",
    uploadedByAdmin: true,
    isApproved: true
  },
  {
    imageUrl: '/assets/images/gallery-3.jpg',
    caption: 'Royal Bridal Glow skin facial transformation',
    category: 'Bridal',
    stylistName: 'Priya Patel',
    serviceName: 'Basic Facial',
    uploadedByAdmin: true,
    isApproved: true
  },
  {
    imageUrl: '/assets/images/gallery-4.jpg',
    caption: 'Glass-finish gel nail art artwork',
    category: 'Nails',
    stylistName: 'Megha Roy',
    serviceName: 'Manicure',
    uploadedByAdmin: true,
    isApproved: true
  },
  {
    imageUrl: '/assets/images/gallery-5.jpg',
    caption: 'Spacious and hygienic salon waiting lounge',
    category: 'Salon Interior',
    stylistName: 'GlowCut Team',
    serviceName: 'Salon Lounge',
    uploadedByAdmin: true,
    isApproved: true
  }
];

const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to database at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Database connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Stylist.deleteMany({});
    await Package.deleteMany({});
    await PromoCode.deleteMany({});
    await Review.deleteMany({});
    await GalleryItem.deleteMany({});

    console.log('[Seed] Old collection data cleared.');

    // Insert Admin User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'GlowCut Admin',
      email: 'admin@glowcut.in',
      passwordHash,
      role: 'admin',
      phone: '9267954524'
    });
    console.log('[Seed] Admin user created (email: admin@glowcut.in / password: admin123).');

    // Insert Services
    await Service.insertMany(servicesData);
    console.log(`[Seed] Inserted ${servicesData.length} Services.`);

    // Insert Stylists
    await Stylist.insertMany(stylistsData);
    console.log(`[Seed] Inserted ${stylistsData.length} Stylists.`);

    // Insert Packages
    await Package.insertMany(packagesData);
    console.log(`[Seed] Inserted ${packagesData.length} Packages & Memberships.`);

    // Insert Promo Codes
    await PromoCode.insertMany(promoCodesData);
    console.log(`[Seed] Inserted ${promoCodesData.length} Promo Codes.`);

    // Insert Reviews
    await Review.insertMany(reviewsData);
    console.log(`[Seed] Inserted ${reviewsData.length} Customer Reviews.`);

    // Insert Gallery Items
    await GalleryItem.insertMany(galleryData);
    console.log(`[Seed] Inserted ${galleryData.length} Gallery items.`);

    console.log('\n[Seed SUCCESS] GlowCut Salon Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed ERROR] Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
