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
    <div>
      Collection
    </div>
  )
}

export default Collection
