// API Route: /api/resources
// Handles resource CRUD, booking, and unbooking logic for the application.
// Uses Next.js API route conventions and professional error handling.

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Resource from "@/lib/database/models/resource.model";
import { auth } from "@clerk/nextjs/server";

// --- GET: Fetch all resources ---
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const resources = await Resource.find({});
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    // Professional error message for failed fetch
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// --- POST: Handle create, edit, delete, book, and unbook actions ---
export async function POST(req: NextRequest) {
  // Clerk authentication: get userId from session claims
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  try {
    await connectToDatabase();
    const body = await req.json();
    body.userId = userId; // Attach userId to the request body for downstream logic

    // --- DELETE Resource ---
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

    // --- BOOK Resource ---
    if (body.action === "book" && body.id && body.userId && body.eventId) {
      const quantity = parseInt(body.quantity, 10);
      if (!quantity || quantity <= 0) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
      const resource = await Resource.findById(body.id);
      if (!resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }
      if (resource.available < quantity) {
        return NextResponse.json({ error: `Only ${resource.available} available` }, { status: 400 });
      }
      resource.available -= quantity;
      await resource.save();
      // Create a booking record
      try {
        const Booking = (await import("@/lib/database/models/booking.model")).default;
        const newBooking = await Booking.create({
          userId: body.userId,
          eventId: body.eventId,
          resources: [
            {
              resourceId: body.id,
              quantity,
            },
          ],
        });
        return NextResponse.json(
          { message: "Booked successfully", booking: newBooking, resource },
          { status: 200 }
        );
      } catch (err) {
        // Booking creation failed, but resource was updated
        console.error("Failed to create booking:", err);
        return NextResponse.json(
          { error: "Resource updated, but booking failed" },
          { status: 500 }
        );
      }
    }

    // --- UNBOOK Resource ---
    if (body.action === "unbook" && body.bookingId && body.quantity && body.userId) {
      // Unbooking logic: restore resource availability and update booking
      console.log("Unbooking resource with body:", body);
      const Booking = (await import("@/lib/database/models/booking.model")).default;
      const ResourceModel = (await import("@/lib/database/models/resource.model")).default;
      try {
        // Support for composite bookingId (e.g., 'id-extra')
        const bookingIdParts = body.bookingId.split("-");
        const bookingId = bookingIdParts[0]; // use only the first 24-char part
        if (bookingId.length !== 24) {
          return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
        }
        const booking = await Booking.findById(bookingId);
        console.log("Booking found:", booking);
        if (!booking) {
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        const resourceId = body.resourceId; // fixed key from body.id to body.resourceId
        const quantityToUnbook = Number(body.quantity);
        if (!resourceId) {
          return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
        }
        if (!quantityToUnbook || quantityToUnbook <= 0) {
          return NextResponse.json({ error: "Quantity must be a positive number" }, { status: 400 });
        }
        const resourceEntry = booking.resources.find(
          (r: any) => r.resourceId.toString() === resourceId
        );
        if (!resourceEntry) {
          return NextResponse.json({ error: "Resource not found in booking" }, { status: 404 });
        }
        const resource = await ResourceModel.findById(resourceId);
        if (!resource) {
          return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }
        const unbookQuantity = Math.min(quantityToUnbook, resourceEntry.quantity);
        // Update resource availability
        resource.available += unbookQuantity;
        await resource.save();
        // Update or remove resource in booking
        resourceEntry.quantity -= unbookQuantity;
        if (resourceEntry.quantity <= 0) {
          booking.resources = booking.resources.filter(
            (r: any) => r.resourceId.toString() !== resourceId
          );
        }
        // If no resources left in booking, delete booking; otherwise, save updates
        if (booking.resources.length === 0) {
          await booking.deleteOne();
        } else {
          await booking.save();
        }
        return NextResponse.json(
          { message: "Unbooked successfully", updatedResource: resource },
          { status: 200 }
        );
      } catch (err) {
        console.error("Error during unbooking:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }

    // --- EDIT Resource ---
    if (body.action === "edit" && body.id) {
      // Only update provided fields
      const { name, type, quantity, available, description } = body;
      const updated = await Resource.findByIdAndUpdate(
        body.id,
        { name, type, quantity, available, description },
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

    // --- CREATE Resource (default) ---
    // Only runs if no action or unrecognized action is provided
    const { name, type, quantity, available, description } = body;
    if (!name || !type || !quantity || !available) {
      return NextResponse.json(
        { error: "Name, type, quantity, and available are required" },
        { status: 400 }
      );
    }
    const newResource = await Resource.create({
      name,
      type,
      quantity,
      available,
      description,
    });
    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    // Catch-all error handler for POST logic
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
