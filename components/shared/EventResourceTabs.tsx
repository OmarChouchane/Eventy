"use client";

import { useState } from "react";

type EventResourceTabsProps = {
  eventId: string;
};

export default function EventResourceTabs({ eventId }: EventResourceTabsProps) {
  const [activeTab, setActiveTab] = useState<"available" | "book">("available");

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-12">
      <nav className="flex mb-6 border-b">
        {["available", "book"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-primary-500 text-primary-600"
                : "text-gray-500 hover:text-primary-500"
            }`}
            onClick={() => setActiveTab(tab as "available" | "book")}
          >
            {tab === "available" ? "Available Resources" : "Book a Resource"}
          </button>
        ))}
      </nav>

      {activeTab === "available" && (
        <div>
          {/* TODO: Replace with actual available resources logic */}
          <p className="text-gray-600">Resources available for this event will be shown here.</p>
        </div>
      )}

      {activeTab === "book" && (
        <div>
          {/* TODO: Replace with actual booking form */}
          <p className="text-gray-600">A form to book resources for this event will go here.</p>
        </div>
      )}
    </div>
  );
}
