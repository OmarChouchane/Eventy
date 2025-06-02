import { auth } from "@clerk/nextjs/server"
import { getEventById } from "@/lib/actions/event.actions"
import EventRegister from "@/components/shared/EventRegister"

type EventPageProps = {
  params: {
    id: string
  }
}

const RegisterEvent = async ({ params }: EventPageProps) => {
  const { sessionClaims } = await auth()
  const currentUserId = sessionClaims?.userId as string

  const event = await getEventById(params.id) // 👈 assuming you have this function

  if (!event) {
    return (
      <div className="wrapper py-10">
        <h2 className="h2-bold text-center">Event not found</h2>
      </div>
    )
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">{event.title}</h3>
      </section>

      <div className="wrapper my-8">
        <EventRegister
          eventId={event._id}
          userId={currentUserId}
          organizerId={event.organizer._id}
        />
      </div>
    </>
  )
}

export default RegisterEvent
