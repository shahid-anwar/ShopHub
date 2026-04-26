import { connectDB } from "@/lib/db";
import { Product, Category } from "@/models";
import ProductForm from "@/components/admin/PrdouctsForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const [product, categories] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({}).lean(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Edit product</h1>
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        product={JSON.parse(JSON.stringify(product))}
      />
    </div>
  );
}
