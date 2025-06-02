import React from 'react'
import { IEvent } from '@/lib/database/models/event.model'
import Link from 'next/link';
import Image from 'next/image';
import { formatDateTime } from "@/lib/utils";
import { auth } from '@clerk/nextjs/server'

import { DeleteConfirmation } from './DeleteConfirmation';

type CardPropsType = {
    event: IEvent;
    hasOrderLink?: boolean;
    hidePrice?: boolean;
}

const Card = async ({ event, hasOrderLink=true, hidePrice }: CardPropsType) => {

    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;
    const isEventCreator = event.organizer._id.toString() === userId;

    

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all  hover:shadow-lg md:min-h-[438px]">
    <Link
      href={`/events/${event._id}`}
      style={{
        backgroundImage: `url(${event.imageUrl})`,
      }}
      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500"
      tabIndex={-1}
    />

    {isEventCreator && !hidePrice && (
      <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
        <Link href={`/events/${event._id}/update`}>
          <Image
            src="/assets/icons/edit.svg"
            alt="edit"
            width={20}
            height={20}
          />
        </Link>

        <DeleteConfirmation eventId={event._id} />

      </div>
    )}

    <div className="flex min-h-[138px] flex-col gap-3 p-5 md:gap-4">
      {!hidePrice && (
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
            {event.isFree ? "FREE" : `$${event.price}`}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1">
            {event.category?.name || "No Category"}
          </p>
          {!isEventCreator && (
            <Link
              href={`/events/${event._id}/register`}
              className="ml-auto p-semibold-14 w-min rounded-full px-4 py-1 text-white bg-primary-500 transition-all duration-200 hover:bg-white hover:text-primary-500 hover:scale-105 hover:shadow-lg hover:outline hover:outline-1 hover:outline-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              Register
            </Link>
          )}
        </div>
      )}

      <p className="p-medium-16 p-medium-18 text-gray-500">
        {formatDateTime(event.startDateTime).dateTime}
      </p>
      <Link
        href={`/events/${event._id}`}
        className="p-medium016 md:p-medium-20 line-clamp-2 flex-1 text-black text-2xl font-bold"
      >
        {event.title}
      </Link>

      <div className="flex-between w-full">
        <p className="p-medium-14 md:p-medium-16 text-gray-600">
          {event.organizer.firstName} {event.organizer.lastName}
        </p>

        {hasOrderLink && (
          <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
            <p className="text-primary-500">Order Details</p>
            <Image
              src="/assets/icons/arrow.svg"
              alt="search"
              width={10}
              height={10}
            />
          </Link>
        )}

        {hidePrice && (
          <Link
            href={event.url || ""}
            target="_blank"
            rel="noreferrer noopener"
            className="flex gap-2"
          >
            <p className="text-primary-500">Join Event</p>
            <Image
              src="/assets/icons/arrow.svg"
              alt="search"
              width={10}
              height={10}
            />
          </Link>
        )}
      </div>
    </div>
  </div>
  )
}

export default Card
