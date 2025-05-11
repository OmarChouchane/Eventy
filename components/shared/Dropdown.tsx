import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ICategory } from '@/lib/database/models/category.model'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { createCategory, getAllCategories } from '@/lib/actions/category.actions'

type DropdownProps = {
    value?: string
    onChangeHandler?: (value: string) => void
}

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [newCategory, setNewCategory] = useState<string>('')

    const [dialogOpen, setDialogOpen] = useState(false) // Controls modal visibility

    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                const category = await createCategory({ categoryName: newCategory.trim() })
                setCategories((prev) => [...prev, category])
                setNewCategory('') // Reset input field
                setDialogOpen(false) // Close modal after adding category
            } catch (err) {
                console.error("Error adding category:", err)
            }
        }
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const categorieList = await getAllCategories()
                if (categorieList) setCategories(categorieList as ICategory[])
            } catch (err) {
                console.error("Failed to fetch categories", err)
            }
        }

        getCategories()
    }, [])

    return (
        <>
            {/* Dropdown Select */}
            <Select onValueChange={onChangeHandler} defaultValue={value}>
                <SelectTrigger className="select-field">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.length > 0 &&
                        categories.map((category) => (
                            <SelectItem key={category._id} value={category._id} className="select-item p-regular-14">
                                {category.name}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>

            {/* Button to Open the Dialog */}
            <div className="mt-3">
                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500"
                            onClick={() => setDialogOpen(true)} // Opens the dialog
                        >
                            + Add new category
                        </button>
                    </AlertDialogTrigger>

                    {/* Dialog Content */}
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Category name"
                                    className="input-field mt-3"
                                />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleAddCategory}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    )
}

export default Dropdown
