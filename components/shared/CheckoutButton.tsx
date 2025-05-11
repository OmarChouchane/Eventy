"use client"

import React from 'react'
import { IEvent } from '@/lib/database/models/event.model'
import { useUser } from '@clerk/nextjs'

const CheckoutButtons = ({ event }: {event : IEvent })=> {

  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className='flex items-center gap-3'>
      {hasEventFinished ? (
        <p>Sorry, tickets are no longer available.</p>
      ): (
        <>button</>
      )}
    </div>
  )
}

export default CheckoutButtons
