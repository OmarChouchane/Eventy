import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Collection } from "@/components/shared/Collection";
import { auth } from "@clerk/nextjs/server";
import { SearchParamProps, UserType } from "@/types";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getUserRegistrations } from "@/lib/actions/registration.actions";
import { getUserById } from "@/lib/actions/user.actions";
import type { IEvent } from "@/lib/database/models/event.model";

export const dynamic = "force-dynamic";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const resolvedSearchParams = await searchParams;
  const regsPageRaw = resolvedSearchParams?.ordersPage;
  const orgPageRaw = resolvedSearchParams?.eventsPage;
  const orgPage =
    Number(Array.isArray(orgPageRaw) ? orgPageRaw[0] : orgPageRaw) || 1;

  // Fetch user and lists with resilience
  type IUserLite = {
    _id: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
    type?: UserType;
  } | null;
  let user: IUserLite = null;
  try {
    user = userId ? await getUserById(userId) : null;
  } catch {
    user = null;
  }

  let registeredEvents: { data: IEvent[]; totalPages: number } = {
    data: [],
    totalPages: 0,
  };
  try {
    const res = await getUserRegistrations(userId);
    if (res)
      registeredEvents = {
        data: (res.data as IEvent[]) || [],
        totalPages: res.totalPages || 0,
      };
  } catch {
    registeredEvents = { data: [], totalPages: 0 };
  }

  let organizedEvents: { data: IEvent[]; totalPages: number } = {
    data: [],
    totalPages: 0,
  };
  try {
    const res = await getEventsByUser({ userId, page: orgPage, limit: 6 });
    if (res)
      organizedEvents = {
        data: (res.data as IEvent[]) || [],
        totalPages: res.totalPages || 0,
      };
  } catch {
    organizedEvents = { data: [], totalPages: 0 };
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <Header />

      {/* Hero / Profile Header */}
      <section className="relative w-full h-[240px] md:h-[320px] overflow-hidden bg-black">
        {user?.photo ? (
          <Image
            src={user.photo}
            alt="Profile cover"
            fill
            priority
            className="object-cover object-center opacity-30"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

        <div className="wrapper relative z-10 h-full flex items-end py-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden ring-2 ring-blue-500/30 bg-gray-800">
              <Image
                src={user?.photo || "/logos/e-wh.png"}
                alt={user?.username || "User avatar"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                {user?.firstName || "User"} {user?.lastName || ""}
              </h1>
              {user?.username && (
                <p className="text-gray-400">@{user.username}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Registered Events */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-8 md:py-10">
        <div className="wrapper flex items-center justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold">Registered</h3>
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
        <div className="wrapper mt-6">
          <Collection
            data={registeredEvents?.data || []}
            emptyTitle="No Registered Events"
            emptyStateSubtext="You haven't registered for any events yet."
            limit={6}
            page={
              Array.isArray(regsPageRaw)
                ? regsPageRaw[0] || "1"
                : (regsPageRaw as string) || "1"
            }
            urlParamName="ordersPage"
            collectionType="Registered_Events"
            total={registeredEvents?.totalPages || 0}
          />
        </div>
      </section>

      {/* Organized Events (visible only for club users) */}
      {user?.type === "club" && (
        <section className="bg-gradient-to-b from-black via-gray-900 to-black text-white py-8 md:py-10">
          <div className="wrapper flex items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-bold">Events Organized</h3>
            <Button asChild size="lg" className="hidden sm:inline-flex">
              <Link href="/events/create">Create New Event</Link>
            </Button>
          </div>
          <div className="wrapper mt-6">
            <Collection
              data={organizedEvents?.data || []}
              emptyTitle="No Events Organized"
              emptyStateSubtext="No worries! You can explore more events by clicking the button above."
              collectionType="Events_Organized"
              limit={6}
              page={
                Array.isArray(orgPageRaw)
                  ? orgPageRaw[0] || "1"
                  : (orgPageRaw as string) || "1"
              }
              urlParamName="eventsPage"
              total={organizedEvents?.totalPages || 0}
            />
          </div>
        </section>
      )}

      {/* Optional: About card (future enhancements) */}
      {/* We can add a small about section later when bio/links exist */}
    </main>
  );
};

export default ProfilePage;
