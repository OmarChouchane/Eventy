import React from 'react'
import { Button } from '../ui/button'
import { IEvent } from '@/lib/database/models/event.model'

const Checkout = ( {event}: {event: IEvent} ) => {


    const onCheckout = async () => {
        console.log('Checkout clicked')
    }


  return (
    <form onSubmit={onCheckout} method="POST">
        <Button type='submit' role='link' size='lg' className='button rounded-full'>
            {event.isFree ? "Get Ticket" : `Buy Ticket`}
        </Button>
    </form>
  )
}

export default Checkout
