import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import React from "react";
import { Collection } from "@/components/shared/Collection";
import CheckoutButton from "@/components/shared/CheckoutButton";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/shared/Header";
import EventResourceTabs from "@/components/shared/EventResourceTabs";
import { getEventRegistrations } from "@/lib/actions/registration.actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventsByUser } from "@/lib/actions/event.actions";
import type { IEvent } from "@/lib/database/models/event.model";
export const dynamic = "force-dynamic";

// Minimal user shape for attendee avatars
type AttendeeUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  email?: string;
};

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  // now both params & searchParams are Promises…
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  // const { page = '1' } = resolvedSearchParams; // not needed, using resolvedSearchParams.page directly

  const event = await getEventById(id);
  if (!event) return notFound();

  const { sessionClaims } = await auth();

  const userId = sessionClaims?.userId as string;

  const organizerMaybe = event.organizer as { _id: string } | null | undefined;
  const organizerId = organizerMaybe?._id;
  const isOrganizer = !!(
    userId &&
    organizerId &&
    String(organizerId) === String(userId)
  );

  const categoryMaybe = event.category as { _id: string } | null | undefined;
  const relatedPageParam = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams.page[0] || "1"
    : resolvedSearchParams?.page || "1";
  let relatedEvents: { data: IEvent[]; totalPages: number } = {
    data: [],
    totalPages: 0,
  };
  if (categoryMaybe?._id) {
    try {
      const rel = await getRelatedEventsByCategory({
        categoryId: categoryMaybe._id,
        eventId: event._id,
        page: relatedPageParam,
      });
      if (rel) {
        relatedEvents = {
          data: (rel.data as IEvent[]) || [],
          totalPages: rel.totalPages || 0,
        };
      }
    } catch {
      // Swallow and fallback to empty related events on transient backend errors
      relatedEvents = { data: [], totalPages: 0 };
    }
  }

  // Fetch registrations for attendee count and avatars
  type RegistrationLite = { user?: AttendeeUser };
  let registrations: RegistrationLite[] = [];
  try {
    const reg = (await getEventRegistrations(event._id)) as RegistrationLite[];
    registrations = Array.isArray(reg) ? reg : [];
  } catch {
    registrations = [];
  }
  const attendees: AttendeeUser[] = registrations
    .map((r) => r.user)
    .filter((u): u is AttendeeUser => !!u);

  // Organizer's other events (visible to all; based on current event's organizer)
  let organizerEvents: { data: IEvent[]; totalPages: number } | null = null;
  let organizerEventsFiltered: IEvent[] = [];
  let organizerEventsPage: number | string = 1;
  if (organizerId) {
    const orgPageRaw = resolvedSearchParams?.["org_page"];
    organizerEventsPage = Array.isArray(orgPageRaw)
      ? orgPageRaw[0] || 1
      : orgPageRaw || 1;
    const pageNum = Number(organizerEventsPage) || 1;
    try {
      const orgRes = await getEventsByUser({
        userId: String(organizerId),
        limit: 6,
        page: pageNum,
      });
      organizerEvents = orgRes
        ? {
            data: (orgRes.data as IEvent[]) || [],
            totalPages: orgRes.totalPages || 0,
          }
        : { data: [], totalPages: 0 };
    } catch {
      organizerEvents = { data: [], totalPages: 0 };
    }
    organizerEventsFiltered = (organizerEvents?.data || []).filter(
      (e: IEvent) => String(e._id) !== String(event._id)
    );
  }

  return (
    <main className="bg-black min-h-screen">
      <Header />

      {/* Cover image like FB event cover */}
      <section className="relative w-full h-[280px] md:h-[420px] lg:h-[520px] overflow-hidden bg-black">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Bottom fade to blend into dark content */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Main content on dark theme */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="wrapper grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-8 md:py-12">
          {/* Left: Primary info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <span className="p-bold-14 rounded-full bg-blue-600/20 text-blue-300 border border-blue-400/20 px-4 py-1">
                {event.category?.name || "General"}
              </span>
              <span className="p-bold-14 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-400/20 px-4 py-1">
                {event.isFree ? "FREE" : `$${event.price}`}
              </span>
              <span className="p-medium-16 ml-1 text-gray-300">
                by{" "}
                <span className="text-orange-400">
                  {event.organizer?.firstName || "Unknown"}{" "}
                  {event.organizer?.lastName || "Organizer"}
                </span>
              </span>
            </div>

            {/* Attendee avatars + count */}
            <div className="flex items-center gap-3 mt-1">
              {attendees.length > 0 ? (
                <>
                  <div className="flex -space-x-2">
                    {attendees.slice(0, 6).map((u) => (
                      <Image
                        key={u._id}
                        src={u.photo || "/logos/e-wh.png"}
                        alt={
                          `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                          "Attendee"
                        }
                        width={32}
                        height={32}
                        unoptimized
                        className="h-8 w-8 rounded-full ring-2 ring-blue-500/20 object-cover bg-gray-800"
                      />
                    ))}
                    {attendees.length > 6 && (
                      <div className="h-8 w-8 rounded-full bg-blue-600/30 text-blue-100 ring-2 ring-blue-500/20 flex items-center justify-center text-xs font-semibold">
                        +{attendees.length - 6}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {attendees.length} registered
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  Be the first to register
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-gray-300">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="Calendar"
                  width={24}
                  height={24}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} ·{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} ·{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-300">
                <Image
                  src="/assets/icons/location.svg"
                  alt="Location"
                  width={24}
                  height={24}
                />
                <p className="p-medium-16 lg:p-regular-20">
                  {event.location || "Location TBA"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-100">
                About this event
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {event.description}
              </p>
              {event.url && (
                <p className="text-primary-400 hover:text-primary-300">
                  <a href={event.url} target="_blank" rel="noreferrer noopener">
                    Learn more
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Right: Sticky meta/CTA */}
          <aside className="md:col-span-1">
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg shadow-blue-500/5 backdrop-blur-sm sticky top-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Price</span>
                <span className="text-lg font-semibold text-white">
                  {event.isFree ? "Free" : `$${event.price}`}
                </span>
              </div>

              {/* CTA: Checkout for attendees, Dashboard for organizer */}
              {isOrganizer ? (
                <Link
                  href={`/dashboard/events/${event._id}`}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-orange-600 text-white py-2.5 px-4 font-semibold hover:bg-orange-500 transition"
                >
                  Open Dashboard
                </Link>
              ) : (
                <CheckoutButton event={event} />
              )}

              <div className="h-px bg-white/10" />
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-gray-400">Organizer:</span>{" "}
                  {event.organizer?.firstName || "Unknown"}{" "}
                  {event.organizer?.lastName || "Organizer"}
                </p>
                <p>
                  <span className="text-gray-400">Category:</span>{" "}
                  {event.category?.name || "General"}
                </p>
                <p>
                  <span className="text-gray-400">Starts:</span>{" "}
                  {formatDateTime(event.startDateTime).dateTime}
                </p>
                <p>
                  <span className="text-gray-400">Ends:</span>{" "}
                  {formatDateTime(event.endDateTime).dateTime}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Organizer resources (only for organizer) */}
      {/*isOrganizer && (
        <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-6">
          <div className="wrapper">
            <EventResourceTabs eventId={event._id} />
          </div>
        </section>
      )}*/}

      {/* Related events */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-10">
        <div className="wrapper flex flex-col gap-8 md:gap-12">
          {organizerEvents && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold">
                Organized by {event.organizer?.firstName || "Unknown"}{" "}
                {event.organizer?.lastName || "Organizer"}
              </h2>
              <Collection
                data={organizerEventsFiltered}
                emptyTitle="No Events Yet"
                emptyStateSubtext="Create your first event"
                collectionType="All_Events"
                limit={6}
                page={organizerEventsPage}
                total={organizerEvents?.totalPages || 0}
                urlParamName="org_page"
              />
              <div className="h-px bg-white/10" />
            </>
          )}

          <h2 className="text-2xl md:text-3xl font-bold">Related Events</h2>
          <Collection
            data={relatedEvents?.data}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={6}
            page={
              Array.isArray(resolvedSearchParams?.page)
                ? resolvedSearchParams.page[0] || 1
                : resolvedSearchParams?.page || 1
            }
            total={relatedEvents?.totalPages || 0}
          />
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
