"use server"

import { connectToDatabase } from "../database"
import Registration from "../database/models/registration.model"
import Event from "../database/models/event.model"
import User from "../database/models/user.model"
import { handleError } from "../utils"

// Register a user to an event
export const registerToEvent = async (eventId: string, userId: string) => {
  try {
    await connectToDatabase()

    // Prevent duplicate registration
    const existingRegistration = await Registration.findOne({ event: eventId, user: userId })

    if (existingRegistration) return false

    const user = await User.findById(userId)
    const event = await Event.findById(eventId)

    if (!user || !event) throw new Error("User or event not found")

    const newRegistration = await Registration.create({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      event: {
        _id: event._id,
        title: event.title,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
      },
    })

    return JSON.parse(JSON.stringify(newRegistration))
  } catch (error) {
    handleError(error)
  }
}

// Check if a user is already registered
export const checkUserRegistration = async (eventId: string, userId: string) => {
  try {
    await connectToDatabase()

    const registration = await Registration.findOne({ event: eventId, user: userId })

    return Boolean(registration)
  } catch (error) {
    handleError(error)
    return false
  }
}
