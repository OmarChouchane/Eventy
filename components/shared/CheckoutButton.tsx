"usee client"

import React from 'react'
import { IEvent } from '@/lib/database/models/event.model'
import { useUser } from '@clerk/nextjs'

const CheckoutButtons = ({ event }: {event : IEvent })=> {

  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div>
      
    </div>
  )
}

export default CheckoutButtons
