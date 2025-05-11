"use client"

import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { ICategory } from "@/lib/database/models/category.model"
import { getAllCategories } from "@/lib/actions/category.actions"




const CategoryFilter = () => {


    const [categories, setCategories] = useState<ICategory[]>([]);
    const searchParams = useSearchParams();
    const router = useRouter();

        useEffect(() => {
            const getCategories = async () => {
              try {
                const categorieList = await getAllCategories();
                if (categorieList) setCategories(categorieList as ICategory[]);
              } catch (err) {
                console.error("Failed to fetch categories", err);
              }
            };
          
            getCategories();
          }, []);

    /*useEffect(() => {
        const timeoutId = setTimeout(() => {
            let newUrl = '';
            if (categories.length > 0) {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'query',
                    value: categories.map(category => category.name).join(','), // Assuming `name` is a property of ICategory
                });
            } else {
                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['query'],
                })
            }

            router.push(newUrl, { scroll: false });
        }, 300);
        return () => clearTimeout(timeoutId);


    }, [categories, searchParams, router]);*/

    const onSelectCategory = (category: string) => {
        let newUrl = '';
            if (category && category !== 'All') {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'category',
                    value: category,
                });
            } else {
                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['query'],
                })
            }

            router.push(newUrl, { scroll: false });
    }

    return (
        <div>
            <Select onValueChange={(value: string) => onSelectCategory(value)}>
                <SelectTrigger className="select-field">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" className='select-item p-regular-14'>All</SelectItem>
                    {categories.length > 0 && categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}
                            className='select-item p-regular-14'>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </div>
    )
}

export default CategoryFilter
