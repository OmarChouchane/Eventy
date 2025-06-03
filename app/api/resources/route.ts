import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Resource from "@/lib/database/models/resource.model";
import { auth } from "@clerk/nextjs/server"

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
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  console.log("userId", userId);
  

  try {
    await connectToDatabase();
    const body = await req.json();
    body.userId = userId; // Attach userId to the request body

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
    if (body.action === "book" && body.id && body.userId && body.eventId) {
  console.log("booking");

  const resource = await Resource.findById(body.id);
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  if (resource.available <= 0) {
    return NextResponse.json({ error: "Resource is fully booked" }, { status: 400 });
  }

  resource.available -= 1;
  await resource.save();

  // ⬇️ Create Booking entry
  try {
    const Booking = (await import("@/lib/database/models/booking.model")).default;
    const newBooking = await Booking.create({
      userId: body.userId,
      eventId: body.eventId,
      resources: [
        {
          resourceId: body.id,
          quantity: 1,
        }
      ],
    });

    return NextResponse.json(
      { message: "Booked successfully", booking: newBooking, resource },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to create booking:", err);
    return NextResponse.json(
      { error: "Resource updated, but booking failed" },
      { status: 500 }
    );
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
