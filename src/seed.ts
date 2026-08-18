import './env';
import dataSource from './db';
import { Category } from './entities/categories';
import { Product } from './entities/product';

async function seed() {
  console.log('Initializing DataSource for seeding...');
  await dataSource.initialize();
  console.log('Database connected.');

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  const categoriesData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Apparel & Accessories', slug: 'apparel-accessories' },
    { name: 'Home & Living', slug: 'home-living' },
  ];

  const categoryMap: Record<string, Category> = {};

  for (const catData of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: catData.slug } });
    if (!cat) {
      cat = categoryRepo.create(catData);
      cat = await categoryRepo.save(cat);
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category exists: ${cat.name}`);
    }
    categoryMap[catData.slug] = cat;
  }

  const productsData = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
      basePrice: 199.99,
      stock: 25,
      isActive: true,
      categorySlug: 'electronics',
    },
    {
      name: 'Minimalist Mechanical Keyboard',
      description: 'Compact 75% layout mechanical keyboard with customizable RGB lighting and hot-swappable switches.',
      basePrice: 129.50,
      stock: 15,
      isActive: true,
      categorySlug: 'electronics',
    },
    {
      name: 'Organic Cotton Crewneck T-Shirt',
      description: 'Ultra-soft, sustainably sourced 100% organic cotton t-shirt built for daily comfort.',
      basePrice: 34.00,
      stock: 50,
      isActive: true,
      categorySlug: 'apparel-accessories',
    },
    {
      name: 'Ergonomic Desk Chair',
      description: 'Breathable mesh office chair with adjustable lumbar support and 3D armrests.',
      basePrice: 289.00,
      stock: 10,
      isActive: true,
      categorySlug: 'home-living',
    },
    {
      name: 'Ceramic Pour-Over Coffee Maker',
      description: 'Handcrafted ceramic coffee dripper designed for precise temperature control and optimal brewing.',
      basePrice: 45.00,
      stock: 30,
      isActive: true,
      categorySlug: 'home-living',
    },
    {
      name: 'Smart Fitness Smartwatch',
      description: 'Water-resistant smartwatch featuring continuous heart rate monitoring, GPS tracking, and sleep analysis.',
      basePrice: 149.99,
      stock: 20,
      isActive: true,
      categorySlug: 'electronics',
    },
  ];

  for (const prodData of productsData) {
    const slug = prodData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let prod = await productRepo.findOne({ where: { name: prodData.name } });
    if (!prod) {
      prod = productRepo.create({
        name: prodData.name,
        description: prodData.description,
        basePrice: prodData.basePrice,
        stock: prodData.stock,
        isActive: prodData.isActive,
        category: categoryMap[prodData.categorySlug],
      });
      await productRepo.save(prod);
      console.log(`Created product: ${prod.name}`);
    } else {
      console.log(`Product exists: ${prod.name}`);
    }
  }

  console.log('Seeding completed successfully!');
  await dataSource.destroy();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
