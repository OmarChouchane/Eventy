import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Booking from "@/lib/database/models/booking.model";
import Event from "@/lib/database/models/event.model";
import Resource from "@/lib/database/models/resource.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Aggregate bookings with event name and resource names
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "resources",
          localField: "resources.resourceId",
          foreignField: "_id",
          as: "resourceDetails",
        },
      },
      {
        $project: {
          eventId: "$event._id",
          eventName: "$event.name",
          resources: {
            $map: {
              input: "$resources",
              as: "r",
              in: {
                resourceId: "$$r.resourceId",
                quantity: "$$r.quantity",
                resourceName: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$resourceDetails",
                        as: "rd",
                        cond: { $eq: ["$$rd._id", "$$r.resourceId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      // Only return bookings where resources array length > 0
      {
        $match: { "resources.0": { $exists: true } },
      },
    ]);

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { eventId, resources } = body;

    if (!eventId || !resources || !Array.isArray(resources) || resources.length === 0) {
      return NextResponse.json(
        { error: "Event ID and at least one resource with quantity are required." },
        { status: 400 }
      );
    }

    // Optionally verify event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // Optional: Verify resource existence and quantities here

    // Create booking
    const newBooking = await Booking.create({
      eventId,
      resources,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
