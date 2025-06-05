// Registration actions for event sign-up, unregistration, and registration checks
// Handles user registration, confirmation emails, and registration queries

"use server"

import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Registration from "../database/models/registration.model"
import { sendConfirmationEmail } from "@/lib/email";

interface RegistrationParams {
  eventId: string
  userId: string
}

// Register a user to an event and send confirmation email
export const registerToEvent = async ({ eventId, userId }: RegistrationParams) => {
  try {
    await connectToDatabase()
    const existing = await Registration.findOne({ event: eventId, user: userId })
    if (existing) return { success: false, message: "Already registered" }
    const registration = await Registration.create({ event: eventId, user: userId })
    // Fetch user and event details for the confirmation email
    const User = (await import("../database/models/user.model")).default;
    const Event = (await import("../database/models/event.model")).default;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (event && user) {
      await sendConfirmationEmail({
        to: user.email,
        event: {
          title: event.title,
          description: event.description,
          location: event.location,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          imageUrl: event.image,
        },
      });
    }
    return { success: true, data: JSON.parse(JSON.stringify(registration)) }
  } catch (error) {
    handleError(error)
  }
}

// Check if a user is registered for an event
export const checkUserRegistration = async ({ eventId, userId }: RegistrationParams) => {
  try {
    await connectToDatabase()
    const registration = await Registration.findOne({ event: eventId, user: userId })
    return !!registration
  } catch (error) {
    handleError(error)
  }
}

// Unregister a user from an event
export const unregisterFromEvent = async ({ eventId, userId }: RegistrationParams) => {
  try {
    await connectToDatabase();
    const deleted = await Registration.findOneAndDelete({ event: eventId, user: userId });
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
          { path: "organizer", select: "_id firstName lastName" }
        ]
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