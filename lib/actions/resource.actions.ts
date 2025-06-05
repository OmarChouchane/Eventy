// Resource actions for creating, updating, deleting, and retrieving resources
// Used for resource management in events and admin dashboard

'use server';

import { connectToDatabase } from "../database";
import Resource from "../database/models/resource.model";
import { revalidatePath } from "next/cache";

interface DeleteResourceParams {
  resourceId: string;
  path: string;
}

// Delete a resource by ID and revalidate the path
export async function deleteResource({ resourceId, path }: DeleteResourceParams) {
  try {
    await connectToDatabase();
    const deleted = await Resource.findByIdAndDelete(resourceId);
    if (deleted) {
      revalidatePath(path);
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete resource");
  }
}

// Update a resource by ID
export async function updateResource({
  resourceId,
  name,
  type,
  quantity,
  description,
}: {
  resourceId: string;
  name: string;
  type: string;
  quantity: number;
  description?: string;
}) {
  try {
    await connectToDatabase();
    await Resource.findByIdAndUpdate(resourceId, {
      name,
      type,
      quantity,
      description,
    });
    revalidatePath("/dashboard/resources"); // Refresh page cache
  } catch (error) {
    handleError(error);
  }
}

// Handle resource-related errors
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error("Resource action error:", error.message);
    throw new Error("Failed to update resource: " + error.message);
  } else {
    console.error("Unknown error:", error);
    throw new Error("Failed to update resource due to an unknown error.");
  }
}

// Get a resource by its ID
export async function getResourceById(id: string) {
  try {
    await connectToDatabase();
    const resource = await Resource.findById(id);
    if (!resource) {
      throw new Error("Resource not found");
    }
    return resource;
  } catch (error) {
    console.error("Get resource by ID error:", error);
    throw new Error("Failed to fetch resource: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}
