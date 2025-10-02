import React from "react";
import { IEvent } from "@/lib/database/models/event.model";
import Link from "next/link";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import EventRegisterButton from "./EventRegisterButton";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = async ({ event, hasOrderLink = true, hidePrice }: CardProps) => {
  // Server-side: rely on sessionClaims.userId which your app previously set to the DB user _id
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string | undefined;
  const isEventCreator =
    !!userId &&
    !!event.organizer &&
    !!event.organizer._id &&
    event.organizer._id.toString() === userId;

  return (
    <CardContainer className="inter-var flex-shrink-0 w-[320px] sm:w-[360px] lg:w-[400px]">
      <CardBody className="bg-black relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full min-h-[380px] md:min-h-[438px] rounded-xl border flex flex-col overflow-visible shadow-md transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-400/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-xl"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 8px 8px",
          }}
        />
        <CardItem translateZ="60" className="flex-grow overflow-visible z-10">
          <Link
            href={`/events/${event._id}`}
            tabIndex={-1}
            className="block w-[400px] h-[200px] relative group"
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={400}
              height={200}
              className="w-full h-full transition-transform duration-500 origin-center group-hover/card:scale-[1] z-0 will-change-transform rounded-xl"
            />
            {/* Soft light glow overlay on hover */}
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow:
                  "0 0 40px 10px rgba(0, 200, 255, 0.25), 0 0 80px 20px rgba(255,255,255,0.10)",
                mixBlendMode: "soft-light",
              }}
            />
          </Link>
        </CardItem>

        {isEventCreator && !hidePrice && (
          <CardItem
            translateZ="100"
            className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all z-[60] pointer-events-auto"
          >
            <Link href={`/events/${event._id}/update`}>
              <Image
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
            <DeleteConfirmation eventId={event._id} />
          </CardItem>
        )}

        <CardItem
          translateZ="60"
          className="flex min-h-[138px] flex-col gap-3 p-5 md:gap-4 z-10"
        >
          <div className="flex gap-2 items-center">
            <span className="p-semibold-14 w-min rounded-full bg-blue-900 px-4 py-1 text-gray-300">
              {event.isFree ? "FREE" : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1">
              {event.category?.name || "No Category"}
            </p>

            {/* Replace previous Register Link with new Register Button */}
            {userId &&
              (!isEventCreator ? (
                <EventRegisterButton eventId={event._id} userId={userId} />
              ) : (
                <Link
                  href={`/dashboard/events/${event._id}`}
                  className="p-semibold-14 rounded-full px-4 py-1 text-white bg-orange-600 hover:bg-red-700 transition ml-auto"
                >
                  Dashboard
                </Link>
              ))}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <span className="p-semibold-14 w-min rounded-full bg-gray-800/50 px-2 pr-8 py-1 text-blue-700 whitespace-nowrap flex items-center gap-1">
                <Image
                  src="/assets/icons/location-grey.svg"
                  alt="location"
                  width={16}
                  height={16}
                />
                <span className="pl-1">{event.location}</span>
              </span>
            </div>
          )}{" "}
          <p className="p-medium-16 p-medium-18 text-gray-500">
            {formatDateTime(event.startDateTime).dateTime}
          </p>
        </CardItem>

        <CardItem translateZ="50" className="w-full px-5 z-10">
          <Link
            href={`/events/${event._id}`}
            className="p-medium016 md:p-medium-20 line-clamp-2 flex-1 text-white text-2xl font-bold"
          >
            {event.title}
          </Link>
        </CardItem>

        <CardItem
          translateZ="40"
          className="flex-between w-full px-5 pb-5 z-10"
        >
          <p className="p-medium-14 md:p-medium-16 text-gray-400">
            {event.organizer
              ? `${event.organizer.firstName} ${event.organizer.lastName}`
              : "Unknown Organizer"}
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
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default Card;
