"use server"

import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Registration from "../database/models/registration.model"
import { sendConfirmationEmail  } from "@/lib/email";

interface RegistrationParams {
  eventId: string
  userId: string
}

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

export const checkUserRegistration = async ({ eventId, userId }: RegistrationParams) => {
  try {
    await connectToDatabase()

    const registration = await Registration.findOne({ event: eventId, user: userId })
    return !!registration
  } catch (error) {
    handleError(error)
  }
}

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

