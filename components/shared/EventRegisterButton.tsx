"use client";

import React, { useState, useEffect, startTransition } from "react";
import { registerToEvent, unregisterFromEvent, checkUserRegistration } from "@/lib/actions/registration.actions";

interface EventRegisterButtonProps {
  eventId: string;
  userId: string;
}

export default function EventRegisterButton({ eventId, userId }: EventRegisterButtonProps) {
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      const isRegistered = await checkUserRegistration({ eventId, userId });
      setRegistered(!!isRegistered);
    });
  }, [eventId, userId]);

  const handleToggleRegister = () => {
    startTransition(async () => {
      if (registered) {
        // Unregister
        const result = await unregisterFromEvent({ eventId, userId });
        if (result?.success) {
          setRegistered(false);
        } else {
          alert(result?.message || "Failed to unregister");
        }
      } else {
        // Register
        const result = await registerToEvent({ eventId, userId });
        if (result?.success) {
          setRegistered(true);
        } else {
          alert(result?.message || "Failed to register");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggleRegister}
      className={`ml-auto p-semibold-14 w-min rounded-full px-4 py-1 text-white transition-all duration-200
        ${registered ? "bg-red-500 hover:bg-red-600" : "bg-primary-500 hover:bg-white hover:text-primary-500 hover:scale-105 hover:shadow-lg hover:outline hover:outline-1 hover:outline-primary-400"}
        focus:outline-none focus:ring-2 focus:ring-primary-400`}
    >
      {registered ? "Unregister" : "Register"}
    </button>
  );
}
