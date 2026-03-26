import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Red Rose Bouquet',
    description: 'A stunning arrangement of 24 premium red roses, perfect for expressing love and passion. Each rose is hand-selected for quality and freshness.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format',
    category: 'Roses',
    stock: 15,
  },
  {
    name: 'White Lily Arrangement',
    description: 'Elegant white lilies arranged in a classic style. These pure white blooms symbolize purity and grace, perfect for any occasion.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=600&auto=format',
    category: 'Bouquets',
    stock: 8,
  },
  {
    name: 'Sunflower Bundle',
    description: 'Bright and cheerful sunflowers to brighten anyone\'s day. This bundle includes 12 large, fresh sunflowers that radiate warmth and happiness.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format',
    category: 'Bouquets',
    stock: 20,
  },
  {
    name: 'Mixed Spring Bouquet',
    description: 'A vibrant mix of seasonal spring flowers including tulips, daisies, and peonies. Celebrate the beauty of spring with this colorful arrangement.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1487530811015-780780169a22?w=600&auto=format',
    category: 'Bouquets',
    stock: 12,
  },
  {
    name: 'Pink Peony Collection',
    description: 'Luxurious pink peonies, lush and full-bloomed. These romantic flowers are a symbol of prosperity and good fortune.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format',
    category: 'Special',
    stock: 6,
  },
  {
    name: 'Lavender Dream',
    description: 'A soothing arrangement of fresh lavender and complementary purple blooms. Perfect for creating a calming atmosphere in any space.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format',
    category: 'Special',
    stock: 10,
  },
  {
    name: 'Tulip Medley',
    description: 'A colorful medley of fresh tulips in various shades. These cheerful flowers are perfect for spring celebrations and gift-giving.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format',
    category: 'Tulips',
    stock: 25,
  },
  {
    name: 'Orchid Elegance',
    description: 'Exotic and sophisticated orchids in a premium arrangement. These long-lasting blooms add a touch of elegance to any home or office.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=600&auto=format',
    category: 'Special',
    stock: 4,
  },
  {
    name: 'Garden Rose Basket',
    description: 'A beautiful basket arrangement featuring garden roses in soft pastel shades. Perfect as a centerpiece or a thoughtful gift.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format',
    category: 'Roses',
    stock: 7,
  },
  {
    name: "Baby's Breath Bundle",
    description: 'Delicate and airy baby\'s breath flowers in a cloud-like arrangement. Perfect for weddings, celebrations, or as an add-on to any bouquet.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format',
    category: 'Bouquets',
    stock: 30,
  },
  {
    name: 'Wildflower Mix',
    description: 'A charming collection of seasonal wildflowers, rustic and romantic. Each arrangement is unique, bringing the beauty of nature indoors.',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format',
    category: 'Bouquets',
    stock: 14,
  },
  {
    name: 'Exotic Tropical Arrangement',
    description: 'Bold and vibrant tropical flowers including bird of paradise, heliconia, and anthuriums. Make a statement with this stunning exotic arrangement.',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1487530811015-780780169a22?w=600&auto=format',
    category: 'Special',
    stock: 3,
  },
];

async function main() {
  console.log('Seeding database...');
  
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
