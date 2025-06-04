"use client";

import React, { useState, useEffect } from "react";
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

export default function ResourceCatalog() {
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
    const [bookedEvents, setBookedEvents] = useState<any[]>([]);


    useEffect(() => {
        fetchResources();
    }, []);


    useEffect(() => {
        if (activeTab === "bookings") fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            const data = await res.json();
            setBookedEvents(data);
        } catch (e) {
            console.error("Error loading bookings");
        }
    };

    const fetchResources = async () => {
        try {
            const res = await fetch("/api/resources");
            const data = await res.json();
            setResources(data);
        } catch (e) {
            setError("Failed to load resources");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

    const resetForm = () => {
        setForm({ name: "", type: "", quantity: 1, available: 1, description: "" });
        setEditingId(null);
    };

    const groupedResources = resources.reduce<Record<string, Resource[]>>((acc, r) => {
        if (!acc[r.type]) acc[r.type] = [];
        acc[r.type].push(r);
        return acc;
    }, {});

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
            <nav className="flex mb-6 border-b">
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

            {activeTab === "add" && (
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                        <label className="block font-medium mb-1" htmlFor="available">
                            Available *
                        </label>
                        <input
                            id="available"
                            name="available"
                            type="number"
                            min={0}
                            value={form.available ?? ""}
                            onChange={handleChange}
                            required
                            className="border rounded p-2 w-full"
                        />
                    </div>

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

                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
                    >
                        {loading ? (editingId ? "Saving..." : "Adding...") : editingId ? "Save Changes" : "Add Resource"}
                    </button>
                </form>
            )}

            {activeTab === "bookings" && (
                <div>
                    {bookedEvents.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No bookings found.</p>
                    ) : (
                        bookedEvents.map((booking) => (
                            <div key={booking.event._id} className="mb-8 border rounded-lg p-4 shadow">
                                <h3 className="text-xl font-bold text-primary-700 mb-2">{booking.event.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Date: {new Date(booking.event.date).toLocaleString()}
                                </p>

                                <ul className="space-y-2">
                                    {booking.resources.map((item: any, idx: number) => (
                                        <li
                                            key={idx}
                                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                                        >
                                            <div className="flex items-center gap-2">
                                                {getResourceIcon(item.resource.type)}
                                                <span className="font-medium">{item.resource.name}</span>
                                                <span className="text-sm text-gray-500">({item.resource.type})</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">
                                                x {item.quantity}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
}
