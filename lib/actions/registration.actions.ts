"use server"

import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Registration from "../database/models/registration.model"

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

    return JSON.parse(JSON.stringify(registration))
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
