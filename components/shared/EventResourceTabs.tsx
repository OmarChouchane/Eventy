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
    const [activeTab, setActiveTab] = useState<"available" | "book">("available");


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


    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch("/api/resources");
            const data = await res.json();
            setResources(data);
        } catch (e) {
            setError("Failed to load resources");
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
                {["available", "book"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-semibold transition ${activeTab === tab
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
                                                    <div className="ml-auto flex gap-2">
                                                     
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
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
