"use server"

import { CreateEventParams } from "@/types"
import { handleError } from "../utils"
import { connect } from "http2"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"

export const createEvent = async ( {event, userId, path}:CreateEventParams ) => {
    console.log("Creating event...")
    console.log("Event data: ", event)
    console.log("User ID: ", userId)
    try {

        const existingEvent = await Event.findOne({ path: path }); // Use a unique identifier (like `path`)
        if (existingEvent) {
        throw new Error("Event already exists.");
        }


        console.log("Creating event...")
        console.log("Event data: ", event)
        console.log("User ID: ", userId)
        console.log("Path: ", path)
        console.log("Event category ID: ", event.categoryId)
        console.log("Event organizer ID: ", userId)
        
        await connectToDatabase();

        const organizer = await User.findById(userId)

        if (!organizer) {
            throw new Error("Organizer not found")
        }

        const newEvent = await Event.create({
            ...event, 
            category:event.categoryId, 
            organizer: userId
        });

        return JSON.parse(JSON.stringify(newEvent));
    } catch (error) {
        handleError(error)
    }
}