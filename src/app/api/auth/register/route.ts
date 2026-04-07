import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // password gets hashed automatically by the pre('save') hook
    const user = await User.create({ name, email, password });

    return NextResponse.json(
      { message: "Account created", userId: user._id },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ValidationError") {
      const messages = Object.values((err as any).errors).map(
        (e: any) => e.message,
      );
      return NextResponse.json({ error: messages[0] }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
