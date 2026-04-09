import { connectDB } from "./db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import "dotenv/config";
async function seed() {
  await connectDB();

  // clear existing
  await Category.deleteMany({});
  await Product.deleteMany({});

  const categories = await Category.insertMany([
    { name: "Shoes", slug: "shoes" },
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Accessories", slug: "accessories" },
  ]);

  const products = [
    {
      name: "Nike Air Max 90",
      description: "Classic Nike running shoe with Air cushioning.",
      price: 8999,
      stock: 20,
      images: ["https://picsum.photos/400"],
      category: categories[0]._id,
    },
    {
      name: "Adidas Stan Smith",
      description: "Iconic leather tennis shoe.",
      price: 6999,
      stock: 15,
      images: ["https://picsum.photos/400"],
      category: categories[0]._id,
    },
    {
      name: "Plain White Tee",
      description: "100% cotton essential tee.",
      price: 999,
      stock: 50,
      images: ["https://picsum.photos/400"],
      category: categories[1]._id,
    },
    {
      name: "Canvas Tote Bag",
      description: "Sturdy everyday tote.",
      price: 1499,
      stock: 30,
      images: ["https://picsum.photos/400"],
      category: categories[2]._id,
    },
  ];

  for (const product of products) {
    const newProduct = new Product(product);
    await newProduct.save(); // ✅ THIS triggers slug hook
  }
  console.log("Seeded successfully");
  process.exit(0);
}

seed();
