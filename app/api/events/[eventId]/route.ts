// app/api/events/[eventId]/route.ts

export const runtime = "nodejs"; // ✅ MUST be first

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Booking from "@/lib/database/models/booking.model";
import Resource from "@/lib/database/models/resource.model";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await context.params;

  try {
    await connectToDatabase();

    const bookings = await Booking.find({ eventId });

    const detailedResources = await Promise.all(
  bookings.flatMap((booking) =>
    booking.resources.map(async (res: any) => {
      const resource = await Resource.findById(res.resourceId);
      return resource
        ? {
            _id: booking._id.toString() + "-" + res.resourceId.toString(),
            bookingId: booking._id,
            resource: {
              _id: resource._id,
              name: resource.name,
            },
            quantity: res.quantity,
          }
        : null;
    })
  )
);

    const filtered = detailedResources.filter(Boolean);

    return NextResponse.json({ resources: filtered }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch booked resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch booked resources" },
      { status: 500 }
    );
  }
}
