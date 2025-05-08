import React from 'react'
import { IEvent } from '@/lib/database/models/event.model'

type CollectionProps = {
    data:IEvent[],
    emptyTitle: string,
    emptyStateSubtext: string,
    collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events',
    page: number,
    totalPages?: number,
    urlParamName?: string,
    limit?: number,


}


const Collection = ({
    data,
    emptyTitle,
    emptyStateSubtext,
    collectionType,
    page,
    totalPages = 0,
    urlParamName,
    limit,
}: CollectionProps) => {

  return (
    <>
        {data.length > 0 ? (
            <div className='flex flex-col items-center gap-10'>
                <ul className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:gap-10'>
                    {data.map((event) => {
                        const hasOrderLink = collectionType === 'Events_Organized';
                        const hidePrice = collectionType === 'My_Tickets';

                        return (
                            <li key={event._id} className='flex flex-col gap-3 rounded-[14px] bg-white p-5 shadow-md'>
                                <img src={event.imageUrl} alt={event.title} className='h-40 w-full rounded-[14px] object-cover' />
                                <h3 className='p-bold-20'>{event.title}</h3>
                                <p className='p-regular-14'>{event.description}</p>
                                <div className='flex justify-between'>
                                    <span className='p-regular-14'>{event.startDateTime.toString()}</span>
                                    {!hidePrice && <span className='p-bold-16'>{event.isFree ? 'Free' : event.price}</span>}
                                </div>
                                {hasOrderLink && <a href={`/events/${event._id}`} className='text-blue-500'>View Orders</a>}
                                {!hasOrderLink && <a href={`/events/${event._id}`} className='text-blue-500'>View Event</a>}
                            </li>
                        )
                    })}
                </ul>
            </div>
        ): (
            <div className='flex-center wrapper min-h-[200px] flex-col gap-3 rounded-[14px] bg-grey-50 py-28 shadow-md text-center'>
                <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
                <p className='p-regular-14'>{emptyStateSubtext}</p>
            </div>
        )}
    </>
  )
}

export default Collection
