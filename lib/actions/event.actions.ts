"use server"

import { CreateEventParams } from "@/types"
import { handleError } from "../utils"
import { connect } from "http2"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Category from "../database/models/category.model"
import Event from "../database/models/event.model"

const populateEvent = async (query: any) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}

export const createEvent = async ( {event, userId, path}:CreateEventParams ) => {


    try {

        const existingEvent = await Event.findOne({ path: path }); // Use a unique identifier (like `path`)
        if (existingEvent) {
        throw new Error("Event already exists.");
        }

        
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

export const getEventById = async (eventId: string) => {
    try {
        await connectToDatabase();

        const event = await populateEvent(Event.findById(eventId));

        if (!event) {
            throw new Error("Event not found")
        }

        return JSON.parse(JSON.stringify(event));

    } catch (error) {
        handleError(error)
    }
}