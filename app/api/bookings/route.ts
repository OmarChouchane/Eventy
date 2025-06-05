import { connectToDatabase } from "@/lib/database";
import Booking from "@/lib/database/models/booking.model";
import Resource from "@/lib/database/models/resource.model";
import Event from "@/lib/database/models/event.model"; // <- ADD THIS
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";


export async function GET(_request: NextRequest) {
    console.log("Fetching all booked resources...");

    try {
        await connectToDatabase();

        const bookings = await Booking.find();

        const detailedResources = await Promise.all(
            bookings.flatMap((booking: any) =>
                booking.resources.map(async (res: any) => {
                    const eventObjectId = new ObjectId(booking.eventId.toString());

                    if (!mongoose.Types.ObjectId.isValid(booking.eventId)) {
                        console.warn("Invalid eventId in booking:", booking._id);
                        return null;
                    }

                    const [resource, event] = await Promise.all([
                        Resource.findById(res.resourceId),
                        Event.findById(eventObjectId),
                    ]);


                    console.log("Resource:", resource);
                    console.log("Event:", event);
                    return resource && event
                        ? {
                            _id: booking._id.toString() + "-" + res.resourceId.toString(),
                            bookingId: booking._id,
                            eventId: booking.eventId,
                            eventTitle: event.title,
                            resource: {
                                _id: resource._id,
                                name: resource.name,
                                type: resource.type,
                                description: resource.description,
                                quantity: resource.quantity,
                                available: resource.available,
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
        console.error("Failed to fetch all booked resources:", error);
        return NextResponse.json(
            { error: "Failed to fetch booked resources" },
            { status: 500 }
        );
    }
}
