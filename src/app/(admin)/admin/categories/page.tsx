import { connectDB } from "@/lib/db";
import { Category } from "@/models";
import CategoryManager from "@/components/admin/CategoryManager";

async function getCategories() {
  await connectDB();
  const categories = await Category.find({}).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Categories</h1>
        <p className="text-gray-400 text-sm mt-1">
          {categories.length} categories
        </p>
      </div>

      <div className="max-w-lg">
        <CategoryManager initialCategories={categories} />
      </div>
    </div>
  );
}
