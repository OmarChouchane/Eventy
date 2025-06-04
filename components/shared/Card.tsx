


import React, { useState, useEffect } from "react"
import { IEvent } from "@/lib/database/models/event.model"
import Link from "next/link"
import Image from "next/image"
import { formatDateTime } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { checkUserRegistration, registerToEvent } from "@/lib/actions/registration.actions"
import { Button } from "@/components/ui/button"
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation"
import EventRegisterButton from "./EventRegisterButton";

interface CardProps {
  eventId: string;
  // other props
}

type CardPropsType = {
  event: IEvent
  hasOrderLink?: boolean
  hidePrice?: boolean
}

const Card = async ({ event, hasOrderLink = true, hidePrice }: CardPropsType) => {

  
  const { sessionClaims } = await auth()
  const userId = sessionClaims?.userId as string
  const isEventCreator = event.organizer && event.organizer._id && event.organizer._id.toString() === userId




  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
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
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          {/* DeleteConfirmation component */}
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="flex min-h-[138px] flex-col gap-3 p-5 md:gap-4">
        
          <div className="flex gap-2 items-center">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
              {event.isFree ? "FREE" : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1">
              {event.category?.name || "No Category"}
            </p>
            

            {/* Replace previous Register Link with new Register Button */}
            {!isEventCreator ? (<EventRegisterButton eventId={event._id} userId={userId} />) :
              <Link
                href={`/dashboard/events/${event._id}`}
                className="p-semibold-14 rounded-full px-4 py-1 text-white bg-orange-600 hover:bg-red-700 transition ml-auto"
              >
                Dashboard
              </Link>}
          </div>
        
        {event.location && (
          <div className="flex items-center gap-2">
            <Image src="/assets/icons/location.svg" alt="location" width={16} height={16} />
            <span className="p-semibold-14 w-min rounded-full bg-blue-100 px-4 py-1 text-blue-600 whitespace-nowrap">
              {event.location}
            </span>
          </div>      )}      <p className="p-medium-16 p-medium-18 text-gray-500">{formatDateTime(event.startDateTime).dateTime}</p>
        <Link href={`/events/${event._id}`} className="p-medium016 md:p-medium-20 line-clamp-2 flex-1 text-black text-2xl font-bold">
          {event.title}
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">
            {event.organizer ? `${event.organizer.firstName} ${event.organizer.lastName}` : "Unknown Organizer"}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
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
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
