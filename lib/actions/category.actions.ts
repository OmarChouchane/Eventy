// Category actions for creating and retrieving event categories
// Used for event categorization and filtering

"use server"

import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"

// Create a new category
export const createCategory = async ({ categoryName }: CreateCategoryParams) => {
    try {
        await connectToDatabase();
        const newCategory = await Category.create({ name: categoryName });
        return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
        handleError(error)
    }
}

// Get all categories for use in dropdowns and filters
export const getAllCategories = async () => {
    try {
        await connectToDatabase();
        const categories = await Category.find();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        handleError(error)
    }
}