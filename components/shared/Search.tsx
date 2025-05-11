"use client"

import Image from 'next/image'
import React, { use, useState } from 'react'
import { Input } from '../ui/input'
import { useEffect } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const Search = ( {placeholder = 'Search title ...'}: { placeholder?: string}) => {

    const [query, setQuery] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let newUrl = '';
            if(query){
                newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'query',
                value: query,
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
        

    }, [query, searchParams, router]);

  return (
    <div className='flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 shadow-md px-4 py-2'>
      <Image 
        src="/assets/icons/search.svg"
        alt="search icon"
        width={24}
        height={24}
        
        />
        <Input
            type="text"
            placeholder={placeholder}
            className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    </div>
  )
}

export default Search
