// Registration actions for event sign-up, unregistration, and registration checks
// Handles user registration, confirmation emails, and registration queries

"use server";

import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Registration from "../database/models/registration.model";
import { sendConfirmationEmail } from "@/lib/email";
import type { IEvent } from "../database/models/event.model";

// Safely read image URL from an event document that may have different field names
function resolveEventImageUrl(eventDoc: unknown): string | undefined {
  if (eventDoc && typeof eventDoc === "object") {
    const rec = eventDoc as Record<string, unknown>;
    const v1 = rec["imageUrl"];
    if (typeof v1 === "string") return v1;
    const v2 = rec["image"];
    if (typeof v2 === "string") return v2;
  }
  return undefined;
}

function coerceDateToString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  // Some ORMs may return objects mimicking Date
  if (
    value &&
    typeof value === "object" &&
    "toISOString" in (value as Record<string, unknown>) &&
    typeof (value as { toISOString?: unknown }).toISOString === "function"
  ) {
    try {
      return (value as { toISOString: () => string }).toISOString();
    } catch {
      // fall through to String()
    }
  }
  return String(value ?? "");
}

interface RegistrationParams {
  eventId: string;
  userId: string;
}

// Register a user to an event and send confirmation email
export const registerToEvent = async ({
  eventId,
  userId,
}: RegistrationParams) => {
  try {
    await connectToDatabase();
    const existing = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    if (existing) return { success: false, message: "Already registered" };
    const registration = await Registration.create({
      event: eventId,
      user: userId,
    });
    // Fetch user and event details for the confirmation email
    const User = (await import("../database/models/user.model")).default;
    const Event = (await import("../database/models/event.model")).default;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (event && user) {
      try {
        // Only attempt to send if email config present
        if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
          // Coerce dates to strings and resolve image url safely
          const startStr = coerceDateToString((event as IEvent).startDateTime);
          const endStr = coerceDateToString((event as IEvent).endDateTime);
          const img = resolveEventImageUrl(event);
          await sendConfirmationEmail({
            to: user.email,
            event: {
              title: event.title,
              description: event.description,
              location: event.location,
              startDateTime: startStr,
              endDateTime: endStr,
              imageUrl: img,
            },
          });
        } else {
          console.warn(
            "Email not sent: missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL env var"
          );
        }
      } catch (e) {
        console.error(
          "sendConfirmationEmail failed, continuing registration:",
          e
        );
        // Do not throw; allow successful registration even if email fails
      }
    }
    return { success: true, data: JSON.parse(JSON.stringify(registration)) };
  } catch (error) {
    handleError(error);
  }
};

// Check if a user is registered for an event
export const checkUserRegistration = async ({
  eventId,
  userId,
}: RegistrationParams) => {
  try {
    await connectToDatabase();
    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    return !!registration;
  } catch (error) {
    handleError(error);
  }
};

// Unregister a user from an event
export const unregisterFromEvent = async ({
  eventId,
  userId,
}: RegistrationParams) => {
  try {
    await connectToDatabase();
    const deleted = await Registration.findOneAndDelete({
      event: eventId,
      user: userId,
    });
    if (!deleted) return { success: false, message: "You are not registered" };
    return { success: true };
  } catch (error) {
    handleError(error);
  }
};

// Get all registrations for a specific event
export const getEventRegistrations = async (eventId: string) => {
  await connectToDatabase();
  return await Registration.find({ event: eventId }).populate("user");
};

// Get all events a user is registered for (with pagination)
export const getUserRegistrations = async (userId: string) => {
  await connectToDatabase();
  const limit = 10; // or any limit you want
  const page = 1; // or get from params
  const skip = (page - 1) * limit;
  const [registrations, eventsCount] = await Promise.all([
    Registration.find({ user: userId })
      .populate({
        path: "event",
        populate: [
          { path: "category", select: "_id name" },
          { path: "organizer", select: "_id firstName lastName" },
        ],
      })
      .skip(skip)
      .limit(limit),
    Registration.countDocuments({ user: userId }),
  ]);
  // Extract and map only the event object with required fields
  const events = registrations
    .map((reg) => {
      const event = reg.event;
      if (!event) return null;
      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        location: event.location,
        imageUrl: event.imageUrl || event.image, // fallback if field is named 'image'
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        category: event.category
          ? {
              _id: event.category._id,
              name: event.category.name,
            }
          : null,
        organizer: event.organizer
          ? {
              _id: event.organizer._id,
              firstName: event.organizer.firstName,
              lastName: event.organizer.lastName,
            }
          : null,
        createdAt: event.createdAt,
        __v: event.__v,
      };
    })
    .filter((event) => !!event);
  return {
    data: JSON.parse(JSON.stringify(events)),
    totalPages: Math.ceil(eventsCount / limit),
  };
};
