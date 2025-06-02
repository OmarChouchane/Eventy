// app/dashboard/events/[id]/page.tsx
import { getEventById } from "@/lib/actions/event.actions";
import { getEventRegistrations } from "@/lib/actions/registration.actions";
import { auth } from '@clerk/nextjs/server'
import React from "react";

interface DashboardPageProps {
  params: { id: string };
}

export default async function EventDashboardPage({ params }: DashboardPageProps) {
  const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;
    const user = sessionClaims?.userId ? { id: userId } : null;
  const registrations = await getEventRegistrations(params.id);
    const event = await getEventById(params.id);

  console.log("Event Dashboard Page", { user, event, registrations, params,  });

if (!event || !event.organizer || event.organizer._id.toString() !== userId) {
  return <div>Event not found or unauthorized</div>;
}


  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${event.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
    {/* Blurry dark overlay */}
    <div className="absolute inset-0 backdrop-blur-sm bg-black/60 z-0" />
    {/* Dark vignette at the top */}
    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/80 to-transparent z-10" />
    <div className="p-8 max-w-3xl mx-auto relative z-20">
        <div className="flex items-center justify-between mb-8 mt-7">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
                {event.title}
            </h1>
            <span className="inline-block px-3 py-1 text-m font-semibold bg-gray-800 text-blue-300 rounded-full">
                Dashboard
            </span>
        </div>

        <section className="bg-white rounded-2xl shadow-lg shadow-gray-500 p-6 ">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            Registrations ({registrations.length})
          </h2>
          <ul className="divide-y divide-gray-200">
            {registrations.length === 0 ? (
              <li className="py-4 text-gray-500">No registrations yet.</li>
            ) : (
              registrations.map((reg: any) => (
            <li key={reg._id} className="flex items-center gap-4 py-4">
              <img
                src={reg.user.photo || "/assets/profile.svg"}
                alt={`${reg.user.firstName} ${reg.user.lastName}`}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {reg.user.firstName} {reg.user.lastName}
                </div>
                <div className="text-gray-500 text-sm">{reg.user.email}</div>
              </div>
              <span className="ml-auto text-gray-400 text-xs whitespace-nowrap">
                {new Date(reg.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
