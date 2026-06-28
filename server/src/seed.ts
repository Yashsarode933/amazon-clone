import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Category definitions with slugs
const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Books', slug: 'books' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Toys & Games', slug: 'toys-games' },
  { name: 'Automotive', slug: 'automotive' },
  { name: 'Grocery', slug: 'grocery' },
  { name: 'Health & Personal Care', slug: 'health-personal-care' }
];

// Sample product image URLs (placeholder images)
const sampleImages = [
  'https://placehold.co/600x600/EEE/31343C?text=Product+Image+1',
  'https://placehold.co/600x600/31343C/EEE?text=Product+Image+2',
  'https://placehold.co/600x600/FF9900/FFF?text=Product+Image+3',
  'https://placehold.co/600x600/146EB4/FFF?text=Product+Image+4',
  'https://placehold.co/600x600/F7CA00/31343C?text=Product+Image+5'
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create seed users for reviews
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: faker.person.fullName(),
        password: '$2a$10$placeholderhashedpassword', // Will never be used
        role: 'CUSTOMER'
      }
    });
    // Create cart and wishlist for each user
    await prisma.cart.create({ data: { userId: user.id } });
    await prisma.wishlist.create({ data: { userId: user.id } });
    users.push(user);
  }

  console.log(`👤 Created ${users.length} seed users`);

  // Create categories
  const createdCategories = await Promise.all(
    categories.map(cat =>
      prisma.category.create({
        data: cat
      })
    )
  );

  console.log(`📦 Created ${createdCategories.length} categories`);

  // Create products
  const products = [];
  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(createdCategories);
    const imageCount = faker.number.int({ min: 1, max: 5 });
    const images = faker.helpers.arrayElements(sampleImages, imageCount);

    const product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 9, max: 500, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 100 }),
        images,
        categoryId: category.id
      },
      include: { category: true }
    });

    products.push(product);
  }

  console.log(`🛍️ Created ${products.length} products`);

  // Create some reviews for products (ensure unique user-product pairs)
  const reviews = [];
  let reviewCount = 0;

  while (reviewCount < 200) {
    const product = faker.helpers.arrayElement(products);
    const user = faker.helpers.arrayElement(users);

    try {
      const review = await prisma.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.paragraph()
        }
      });
      reviews.push(review);
      reviewCount++;
    } catch (e: any) {
      if (e.code === 'P2002') {
        // Unique constraint violation, try another pair
        continue;
      }
      throw e;
    }
  }

  // Update product ratings
  for (const product of products) {
    const productReviews = reviews.filter(r => r.productId === product.id);
    if (productReviews.length > 0) {
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await prisma.product.update({
        where: { id: product.id },
        data: {
          rating: Number(avgRating.toFixed(1)),
          reviewCount: productReviews.length
        }
      });
    }
  }

  console.log(`⭐ Created ${reviews.length} reviews`);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
