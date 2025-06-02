import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Resource from "@/lib/database/models/resource.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const resources = await Resource.find({});

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, type, quantity, description } = body;

    if (!name || !type || !quantity) {
      return NextResponse.json(
        { error: "Name, type and quantity are required" },
        { status: 400 }
      );
    }

    const newResource = await Resource.create({
      name,
      type,
      quantity,
      description,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
