import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "./db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

// copy of your slug logic from the model
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-");
}

async function seed() {
  await connectDB();

  await Category.deleteMany({});
  await Product.deleteMany({});

  console.log("Cleared existing data...");

  const categories = await Category.insertMany([
    { name: "Shoes", slug: "shoes" },
    { name: "T-Shirts", slug: "t-shirts" },
    { name: "Accessories", slug: "accessories" },
    { name: "Bags", slug: "bags" },
    { name: "Watches", slug: "watches" },
  ]);

  const [shoes, tshirts, accessories, bags, watches] = categories;

  const products = [
    {
      name: "Nike Air Max 90",
      description:
        "A timeless silhouette with visible Air cushioning for all-day comfort. Features a leather and mesh upper for breathability and durability. Perfect for both casual wear and light training sessions.",
      price: 8999,
      stock: 20,
      category: shoes._id,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      ],
    },
    {
      name: "Adidas Stan Smith",
      description:
        "The iconic leather tennis shoe that became a streetwear staple. Clean minimal design with perforated 3-Stripes and a cupsole for extra cushioning.",
      price: 6999,
      stock: 15,
      category: shoes._id,
      images: [
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
      ],
    },
    {
      name: "Converse Chuck Taylor All Star",
      description:
        "The original basketball shoe turned cultural icon. Canvas upper with rubber toe cap and vulcanized sole.",
      price: 4999,
      stock: 30,
      category: shoes._id,
      images: [
        "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80",
      ],
    },
    {
      name: "New Balance 574",
      description:
        "Built for long lasting comfort with ENCAP midsole technology. A heritage running silhouette that has stood the test of time.",
      price: 7499,
      stock: 12,
      category: shoes._id,
      images: [
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
      ],
    },
    {
      name: "Vans Old Skool",
      description:
        "The first Vans shoe to feature the iconic side stripe. Durable canvas and suede upper with padded collar for support and flexibility.",
      price: 5499,
      stock: 25,
      category: shoes._id,
      images: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
      ],
    },
    {
      name: "Premium White Essential Tee",
      description:
        "Made from 100% ring-spun cotton for an ultra-soft feel. Relaxed fit with ribbed crewneck and slightly dropped shoulders for a modern silhouette.",
      price: 1299,
      stock: 60,
      category: tshirts._id,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      ],
    },
    {
      name: "Oversized Graphic Tee",
      description:
        "Heavyweight 280gsm cotton with a boxy oversized fit. Features a bold chest graphic screen-printed with water-based inks.",
      price: 1799,
      stock: 40,
      category: tshirts._id,
      images: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
      ],
    },
    {
      name: "Striped Breton Tee",
      description:
        "Classic nautical stripes in a timeless navy and white pattern. Slim fit with a slightly longer back hem.",
      price: 1599,
      stock: 35,
      category: tshirts._id,
      images: [
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
      ],
    },
    {
      name: "Vintage Washed Black Tee",
      description:
        "Stone-washed for a faded vintage look with soft texture. The kind of tee that looks like it has a history.",
      price: 1499,
      stock: 45,
      category: tshirts._id,
      images: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      ],
    },
    {
      name: "Leather Bifold Wallet",
      description:
        "Crafted from full-grain vegetable-tanned leather that develops a rich patina over time. Slim profile with 6 card slots.",
      price: 2499,
      stock: 50,
      category: accessories._id,
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      ],
    },
    {
      name: "Polarized Aviator Sunglasses",
      description:
        "Classic teardrop aviator frame in stainless steel with polarized lenses that eliminate glare. UV400 protection.",
      price: 3299,
      stock: 20,
      category: accessories._id,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      ],
    },
    {
      name: "Minimalist Canvas Belt",
      description:
        "Woven canvas belt with a brushed nickel buckle. Casual and versatile — pairs equally well with shorts, chinos, or jeans.",
      price: 999,
      stock: 55,
      category: accessories._id,
      images: [
        "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
      ],
    },
    {
      name: "Canvas Tote Bag",
      description:
        "Made from 12oz natural canvas with reinforced stitching. Fits a 15-inch laptop with room to spare.",
      price: 1999,
      stock: 30,
      category: bags._id,
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
      ],
    },
    {
      name: "Leather Messenger Bag",
      description:
        "Full-grain crazy horse leather that scratches and ages beautifully. Padded laptop sleeve fits up to 15 inches.",
      price: 7999,
      stock: 10,
      category: bags._id,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      ],
    },
    {
      name: "Minimal Daypack",
      description:
        "Lightweight 20L backpack made from water-resistant ripstop nylon. Built for city commutes and weekend travel.",
      price: 4499,
      stock: 18,
      category: bags._id,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      ],
    },
    {
      name: "Classic Field Watch",
      description:
        "Inspired by military field watches with a clean 38mm stainless steel case. Japanese quartz movement with sapphire crystal glass.",
      price: 12999,
      stock: 8,
      category: watches._id,
      images: [
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      ],
    },
    {
      name: "Minimalist Mesh Watch",
      description:
        "Ultra-thin 6mm case with a stainless steel mesh bracelet. Elegant enough for formal occasions, understated enough for everyday wear.",
      price: 9499,
      stock: 12,
      category: watches._id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      ],
    },
    {
      name: "Diver Watch 200m",
      description:
        "200m water resistant diver with a unidirectional bezel and luminous hands. Automatic movement with 42-hour power reserve.",
      price: 18999,
      stock: 5,
      category: watches._id,
      images: [
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
      ],
    },
  ];

  // add slug to every product before inserting
  const productsWithSlugs = products.map((p) => ({
    ...p,
    slug: generateSlug(p.name),
  }));

  await Product.insertMany(productsWithSlugs);

  console.log(
    `✅ Seeded ${categories.length} categories and ${productsWithSlugs.length} products`,
  );
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
