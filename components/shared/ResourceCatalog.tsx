// ResourceCatalog.tsx
// Main admin dashboard component for managing resources and bookings.
// Uses React state, effects, and Next.js conventions for client-side interactivity.

"use client";

import React, { useState, useEffect } from "react";
import {
    FaBoxOpen,
    FaDesktop,
    FaChalkboardTeacher,
    FaTrash,
    FaEdit,
} from "react-icons/fa";

// --- Utility: Get icon for resource type ---
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

// --- Resource type definition ---
interface Resource {
    _id: string;
    name: string;
    type: string;
    quantity: number;
    available: number;
    description?: string;
}

// --- Main Component ---
export default function ResourceCatalog() {
    // --- State management ---
    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState({
        name: "",
        type: "",
        quantity: 1,
        available: 1,
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"catalog" | "add" | "bookings">("catalog");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [bookedEvents, setBookedEvents] = useState<Record<string, any[]>>({});

    // --- Fetch resources on mount ---
    useEffect(() => {
        fetchResources();
    }, []);

    // --- Fetch bookings when bookings tab is active ---
    useEffect(() => {
        if (activeTab === "bookings") fetchBookings();
    }, [activeTab]);

    // --- Fetch bookings and group by eventId ---
    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            // Group bookings by eventId for table display
            const groupedByEvent: Record<string, any[]> = {};
            data.resources.forEach((item: any) => {
                const eventId = item.eventId;
                if (!groupedByEvent[eventId]) {
                    groupedByEvent[eventId] = [];
                }
                groupedByEvent[eventId].push(item);
            });
            setBookedEvents(groupedByEvent);
        } catch (e) {
            console.error("Error loading bookings", e);
        }
    };

    // --- Fetch all resources ---
    const fetchResources = async () => {
        try {
            const res = await fetch("/api/resources");
            const data = await res.json();
            setResources(data);
        } catch (e) {
            setError("Failed to load resources");
        }
    };

    // --- Form change handler ---
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- Form submit handler for add/edit resource ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = editingId
                ? { action: "edit", id: editingId, ...form }
                : { ...form };
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...payload,
                    quantity: Number(form.quantity),
                }),
            });
            if (!res.ok) throw new Error("Failed to submit resource");
            const updatedResource = await res.json();
            if (editingId) {
                setResources((prev) =>
                    prev.map((r) => (r._id === editingId ? updatedResource : r))
                );
            } else {
                setResources((prev) => [...prev, updatedResource]);
            }
            resetForm();
            setActiveTab("catalog");
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // --- Delete resource handler ---
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", id }),
            });
            if (!res.ok) throw new Error("Failed to delete resource");
            setResources((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            alert("Delete failed.");
        }
    };

    // --- Start editing a resource ---
    const startEdit = (resource: Resource) => {
        setForm({
            name: resource.name,
            type: resource.type,
            quantity: resource.quantity,
            available: resource.available,
            description: resource.description || "",
        });
        setEditingId(resource._id);
        setActiveTab("add");
    };

    // --- Reset form to initial state ---
    const resetForm = () => {
        setForm({ name: "", type: "", quantity: 1, available: 1, description: "" });
        setEditingId(null);
    };

    // --- Group resources by type for catalog display ---
    const groupedResources = resources.reduce<Record<string, Resource[]>>((acc, r) => {
        if (!acc[r.type]) acc[r.type] = [];
        acc[r.type].push(r);
        return acc;
    }, {});

    // --- Render ---
    return (
        <div className=" bg-gray-50 bg-dotted-pattern">
            <div className="flex flex-col items-center py-10">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-lg text-gray-500 font-medium">
                    Manage resources, bookings, and more
                </p>
            </div>
            <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
                {/* --- Tab Navigation --- */}
                <nav className="flex mb-6 border-b">
                    {/* Catalog Tab */}
                    <button
                        className={`px-4 py-2 font-semibold transition ${activeTab === "catalog"
                            ? "border-b-2 border-primary-500 text-primary-600"
                            : "text-gray-500 hover:text-primary-500"
                            }`}
                        onClick={() => {
                            setActiveTab("catalog");
                            resetForm();
                        }}
                    >
                        Catalog
                    </button>
                    {/* Add/Edit Tab */}
                    <button
                        className={`px-4 py-2 font-semibold transition ${activeTab === "add"
                            ? "border-b-2 border-primary-500 text-primary-600"
                            : "text-gray-500 hover:text-primary-500"
                            }`}
                        onClick={() => {
                            setActiveTab("add");
                            resetForm();
                        }}
                    >
                        {editingId ? "Edit Resource" : "Add New Resource"}
                    </button>
                    {/* Bookings Tab */}
                    <button
                        className={`px-4 py-2 font-semibold transition ${activeTab === "bookings"
                            ? "border-b-2 border-primary-500 text-primary-600"
                            : "text-gray-500 hover:text-primary-500"
                            }`}
                        onClick={() => {
                            setActiveTab("bookings");
                            resetForm();
                        }}
                    >
                        Bookings
                    </button>
                </nav>

                {/* --- Catalog Tab Content --- */}
                {activeTab === "catalog" && (
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
                                                    Quantity: {r.quantity} {" | "}
                                                    <span className={r.available === 0 ? "text-red-500" : "text-green-600"}>
                                                        Available: {r.available}
                                                    </span>
                                                </p>
                                                {r.description && (
                                                    <p className="text-gray-500 mt-2 italic text-sm">{r.description}</p>
                                                )}
                                                <div className="flex gap-2 mt-3 justify-end w-full">
                                                    <div className="ml-auto flex gap-2">
                                                        <button
                                                            onClick={() => startEdit(r)}
                                                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(r._id)}
                                                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="w-5 h-5" />
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
                )}

                {/* --- Add/Edit Resource Form --- */}
                {activeTab === "add" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block font-medium mb-1" htmlFor="name">
                                Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block font-medium mb-1" htmlFor="type">
                                Type *
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                                className="border rounded p-2 w-full"
                            >
                                <option value="">Select type</option>
                                <option value="room">Room</option>
                                <option value="audiovisual">Audiovisual</option>
                                <option value="material">Material</option>
                            </select>
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block font-medium mb-1" htmlFor="quantity">
                                Quantity *
                            </label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min={1}
                                value={form.quantity}
                                onChange={handleChange}
                                required
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        {/* Available */}
                        <div>
                            <label className="block font-medium mb-1" htmlFor="available">
                                Available *
                            </label>
                            <input
                                id="available"
                                name="available"
                                type="number"
                                min={0}
                                max={form.quantity}
                                value={form.available ?? ""}
                                onChange={handleChange}
                                required
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block font-medium mb-1" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        {/* Error message */}
                        {error && <p className="text-red-600">{error}</p>}
                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
                        >
                            {loading ? (editingId ? "Saving..." : "Adding...") : editingId ? "Save Changes" : "Add Resource"}
                        </button>
                    </form>
                )}

                {/* --- Bookings Tab Content --- */}
                {activeTab === "bookings" && (
                    <div>
                        {/* If no bookings, show message */}
                        {Object.keys(bookedEvents).length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No bookings found.</p>
                        ) : (
                            Object.entries(bookedEvents).map(([eventId, resources]) => (
                                <div key={eventId} className="mb-10">
                                    <h2 className="text-xl font-bold mb-3 text-indigo-700 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            Event title: {resources[0]?.eventTitle || "Unknown"}
                                        </span>
                                    </h2>
                                    <div className="overflow-x-auto rounded-lg shadow">
                                        <table className="min-w-full bg-white border border-gray-200">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700">
                                                    <th className="px-4 py-2 text-left font-semibold">Resource</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Quantity Booked</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resources.map((res) => (
                                                    <tr key={res._id} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2 flex items-center gap-2">
                                                            {getResourceIcon(res.resource.type)}
                                                            <span className="font-medium">{res.resource.name}</span>
                                                        </td>
                                                        <td className="px-4 py-2 capitalize">{res.resource.type}</td>
                                                        <td className="px-4 py-2">{res.quantity}</td>
                                                        <td className="px-4 py-2 text-gray-500">{res.resource.description || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

