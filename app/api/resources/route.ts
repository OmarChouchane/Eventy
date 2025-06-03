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

    console.log("Incoming POST:", body);

    // 🔴 DELETE logic
    if (body.action === "delete" && body.id) {
      const deleted = await Resource.findByIdAndDelete(body.id);
      if (!deleted) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Resource deleted successfully" },
        { status: 200 }
      );
    }

    // 🟢 BOOK logic
    if (body.action === "book" && body.id) {
      console.log("booking");
      const resource = await Resource.findById(body.id);
      console.log("found resource", resource);
      console.log("resource available", resource?.available);
      if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }

      if (resource.available <= 0) {
        return NextResponse.json({ error: "Resource is fully booked" }, { status: 400 });
      }
      console.log("resource available before booking", resource.available);
      try {
        resource.available -= 1;
        await resource.save();
        console.log("resource available after booking", resource.available);
        return NextResponse.json(resource, { status: 200 });
      } catch (err) {
        console.error("Failed to update resource:", err);
        return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
      }

    }


    // 🔄 UNBOOK logic
    if (body.action === "unbook" && body.id) {
      const resource = await Resource.findById(body.id);
      if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }
      if (resource.available < resource.quantity) {
        resource.available += 1;
        await resource.save();
      }
      return NextResponse.json(resource, { status: 200 });
    }


    // 🟡 EDIT logic
    if (body.action === "edit" && body.id) {
      const { name, type, quantity, description } = body;
      const updated = await Resource.findByIdAndUpdate(
        body.id,
        { name, type, quantity, description },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json(
          { error: "Resource not found or update failed" },
          { status: 404 }
        );
      }
      return NextResponse.json(updated, { status: 200 });
    }

    // 🟢 CREATE logic (default)
    const { name, type, quantity, description } = body;
    if (!name || !type || !quantity) {
      return NextResponse.json(
        { error: "Name, type, and quantity are required" },
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
      { error: "Failed to process request" },
      { status: 500 }
    );
  }


}
