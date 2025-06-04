"use client";

import { useState, useEffect } from 'react';
import {
    FaBoxOpen,
    FaDesktop,
    FaChalkboardTeacher,
    FaTrash,
    FaEdit,
} from "react-icons/fa";

const getResourceIcon = (type: string) => {
    switch (type) {
        case "room":
            return <FaChalkboardTeacher className="text-indigo-500 w-6 h-6 mr-3" />;
        case "audiovisual":
            return <FaDesktop className="text-green-500 w-6 h-6 mr-3" />;
        case "material":
            return <FaBoxOpen className="text-yellow-500 w-6 h-6 mr-3" />;
        default:
            return <FaBoxOpen className="text-gray-400 w-6 h-6 mr-3" />;
    }
};

interface Resource {
    _id: string;
    name: string;
    type: string;
    quantity: number;
    available: number;
    description?: string;
}
type EventResourceTabsProps = {
    eventId: string;
};

export default function EventResourceTabs({ eventId }: EventResourceTabsProps) {
    const [activeTab, setActiveTab] = useState<"available" | "booked resources">("available");


    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState({
        name: "",
        type: "",
        quantity: 1,
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [bookedEvents, setBookedEvents] = useState<any[]>([]);
    const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
    const [bookedResources, setBookedResources] = useState<any[]>([]);


    useEffect(() => {
        if (!eventId) return;
        fetchResources();
        fetchBookedResources();
    }, [eventId]);

    const fetchResources = async () => {
        try {
            const res = await fetch("/api/resources");
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            setResources(data || []);
        } catch (e) {
            setError("Failed to load resources");
        }
    };

    const fetchBookedResources = async () => {
        if (!eventId) return; // Double check eventId presence
        try {
            const res = await fetch(`/api/events/${eventId}`);
            if (!res.ok) throw new Error("Network response was not ok");
            const data = await res.json();
            setBookedResources(Array.isArray(data.resources) ? data.resources : []);
        } catch (e) {
            setError("Failed to load booked resources");
        }
    };







const handleBookResource = async (id: string) => {
  const quantity = quantityMap[id] || 1;
  try {
    const res = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify({ action: "book", id, quantity, userId: "user-id-placeholder", eventId }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to book");

    // Refresh both lists from server to keep data consistent
    await fetchResources();
    await fetchBookedResources();

  } catch (err) {
    setError((err as Error).message);
  }
};

const handleUnbook = async (bookingId: string, resourceId: string, quantity: number) => {
  try {
    const res = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify({
        action: "unbook",
        bookingId,
        resourceId,
        quantity,
        userId: "user-id-placeholder",
      }),
    });

    if (res.ok) {
      // Refresh both lists from server to keep data consistent
      await fetchResources();
      await fetchBookedResources();
    } else {
      const errorData = await res.json();
      console.error("Unbook failed:", errorData);
    }
  } catch (error) {
    console.error("Unbook error:", error);
  }
};






    const groupedResources = resources.reduce<Record<string, Resource[]>>((acc, r) => {
        if (!acc[r.type]) acc[r.type] = [];
        acc[r.type].push(r);
        return acc;
    }, {});



    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-12">
            <nav className="flex mb-6 border-b">
                {["available", "booked resources"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-semibold transition ${activeTab === tab
                            ? "border-b-2 border-primary-500 text-primary-600"
                            : "text-gray-500 hover:text-primary-500"
                            }`}
                        onClick={() => setActiveTab(tab as "available" | "booked resources")}
                    >
                        {tab === "available" ? "Available Resources" : "Booked Resources"}
                    </button>
                ))}
            </nav>

            {activeTab === "available" && (
                <div>
                    <div>
                        {Object.keys(groupedResources).length === 0 && (
                            <div className="text-center text-gray-500 py-8">No resources found.</div>
                        )}
                        {Object.entries(groupedResources).map(([type, group]) => (
                            <div key={type} className="mb-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="rounded-full bg-gradient-to-tr from-white-500 to-indigo-400 p-4 pl-6 shadow-lg">
                                        {getResourceIcon(type)}
                                    </span>
                                    <h2 className="text-3xl font-extrabold text-gray-900 capitalize tracking-tight drop-shadow-sm">
                                        {type}
                                    </h2>
                                    <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        {group.length} {group.length === 1 ? "item" : "items"}
                                    </span>
                                </div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {group.map((r) => (
                                        <li
                                            key={r._id}
                                            className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full"
                                        >
                                            {getResourceIcon(r.type)}
                                            <div className="flex-1 w-full">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    {r.name}
                                                    <span className="text-sm font-medium text-indigo-600 bg-indigo-100 rounded px-2 py-0.5 ml-auto">
                                                        {r.type}
                                                    </span>
                                                </h3>

                                                <p className="text-gray-600 mt-1">

                                                    <span className={r.available === 0 ? "text-red-500" : "text-green-600"}>
                                                        Available: {r.available}
                                                    </span>
                                                </p>
                                                {r.description && (
                                                    <p className="text-gray-500 mt-2 italic text-sm">{r.description}</p>
                                                )}
                                                <div className="flex gap-2 mt-3 justify-end w-full">
                                                    <div className="ml-auto flex gap-2 items-center">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={r.available}
                                                            value={quantityMap[r._id] || 1}
                                                            onChange={(e) => {
                                                                const val = Math.min(r.available, Math.max(1, parseInt(e.target.value) || 1));
                                                                setQuantityMap((prev) => ({ ...prev, [r._id]: val }));
                                                            }}
                                                            className="w-16 px-2 py-1 border rounded text-sm"
                                                        />

                                                        <button
                                                            onClick={() => handleBookResource(r._id)}
                                                            className={`text-white text-sm px-3 py-1 rounded shadow ${r.available > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                                                                }`}
                                                            disabled={r.available === 0}
                                                        >
                                                            Book
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {Object.keys(groupedResources).length === 0 && (
                        <p className="text-gray-600">No resources available.</p>
                    )}
                </div>
            )}

            {activeTab === "booked resources" && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Booked Resources</h3>
                    <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Resource</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Unbook</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookedResources?.map((booking) => (
                                <tr key={booking._id} className="border-t border-gray-200">
                                    <td className="px-4 py-2">{booking.resource.name}</td>
                                    <td className="px-4 py-2">{booking.quantity}</td>
                                    <td className="px-4 py-2 flex gap-2 items-center">
                                        <input
                                            type="number"
                                            min={1}
                                            max={booking.quantity}
                                            value={booking.unbookQty || 1}
                                            onChange={(e) =>
                                                setBookedResources((prev) =>
                                                    prev.map((b) =>
                                                        b._id === booking._id
                                                            ? { ...b, unbookQty: parseInt(e.target.value) }
                                                            : b
                                                    )
                                                )
                                            }
                                            className="w-16 px-2 py-1 border rounded-md text-sm"
                                        />
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                            onClick={() => handleUnbook(booking._id, booking.resource._id, booking.unbookQty || 1)}
                                        >
                                            Unbook
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
