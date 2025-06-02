"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { checkUserRegistration, registerToEvent } from "@/lib/actions/registration.actions"

type EventRegisterProps = {
  eventId: string
  userId: string
  organizerId: string
}

const EventRegister = ({ eventId, userId, organizerId }: EventRegisterProps) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const fetchRegistrationStatus = async () => {
    setLoading(true)
    const result = await checkUserRegistration({ eventId, userId }) // ✅ FIXED
    setIsRegistered(!!result)
    setLoading(false)
  }

  useEffect(() => {
    fetchRegistrationStatus()
  }, [eventId, userId])

  const handleRegister = async () => {
    try {
      const result = await registerToEvent({ eventId, userId }) // ✅ FIXED
      if (result?.success !== false) {
        setIsRegistered(true)
      }
    } catch (error) {
      console.error("Failed to register:", error)
    }
  }

  if (userId === organizerId) return null

  return (
    <Button
      disabled={isRegistered || loading}
      onClick={handleRegister}
      className="w-full mt-4"
    >
      {isRegistered ? "Registered" : loading ? "Checking..." : "Register"}
    </Button>
  )
}

export default EventRegister
