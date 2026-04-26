import { connectDB } from "@/lib/db";
import { Category } from "@/models";
import ProductForm from "@/components/admin/PrdouctsForm";

async function getCategories() {
  await connectDB();
  const categories = await Category.find({}).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
