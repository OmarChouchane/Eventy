import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Collection from '@/components/shared/Collection'

const page = () => {
    return (
        <>
            {/* MY EVENTS */}
            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>My Events</h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href="/#events">
                            Explore More Events</Link>
                    </Button>
                </div>
            </section>

            {/*<section className='wrapper my-8'>
                <Collection
                    data={events?.data}
                    emptyTitle="No Events In My Collection"
                    emptyStateSubtext="No worries! You can explore more events by clicking the button above."
                    collectionType="My_Tickets"
                    limit={3}
                    page={1}
                    urlParamName='ordersPage'
                    totalPages={2}
                />
            </section>*/}

            <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between'>
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href="/events/create">
                            Create New Event</Link>
                    </Button>
                </div>
            </section>

            {/*<section className='wrapper my-8'>
                <Collection
                    data={events?.data}
                    emptyTitle="No Events In My Collection"
                    emptyStateSubtext="No worries! You can explore more events by clicking the button above."
                    collectionType="My_Tickets"
                    limit={3}
                    page={1}
                    urlParamName='ordersPage'
                    totalPages={2}
                />
            </section>*/}
        </>
    )
}

export default page
