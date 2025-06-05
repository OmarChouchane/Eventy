// User actions for creating, retrieving, updating, and deleting users
// Handles user relationships with events and orders

'use server';

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Order from "../database/models/order.model";

// Create a new user
export const createUser = async (user: CreateUserParams) => {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// Get a user by their database ID
export async function getUserById(userId: string) {
    try {
      await connectToDatabase();
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      return JSON.parse(JSON.stringify(user));
    } catch (error) {
      handleError(error);
    }
}

// Update a user by their Clerk ID
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
      await connectToDatabase();
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
        new: true,
      });
      if (!updatedUser) throw new Error("User update failed");
      return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
      handleError(error);
    }
}

// Delete a user by their Clerk ID and clean up relationships
export async function deleteUser(clerkId: string) {
    try {
      await connectToDatabase();
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId });
      if (!userToDelete) {
        throw new Error("User not found");
      }
      // Unlink relationships
      await Promise.all([
        // Remove user from events
        Event.updateMany(
          { _id: { $in: userToDelete.events } },
          { $pull: { organizer: userToDelete._id } },
        ),
        // Remove user from orders
        Order.updateMany(
          { _id: { $in: userToDelete.orders } },
          { $unset: { buyer: 1 } },
        ),
      ]);
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id);
      revalidatePath("/");
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
      handleError(error);
    }
}