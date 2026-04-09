import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "MongoDB connected" });
  } catch (err) {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
