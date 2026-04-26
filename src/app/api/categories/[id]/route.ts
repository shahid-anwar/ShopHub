import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models";
import { auth } from "@/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
