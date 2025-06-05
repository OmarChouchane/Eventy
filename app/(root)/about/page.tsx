import React from "react";

export default function AboutPage() {
    return (
        <main className="relative min-h-screen bg-dotted-pattern from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
            {/* Animated Background */}
            <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            >
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-300/40 rounded-full blur-3xl animate-[pulse_4s_infinite] shadow-2xl" />
            <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-300/40 rounded-full blur-2xl animate-[pulse_6s_infinite] shadow-xl" />
            </div>
            <section className="relative z-10 max-w-2xl w-full text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-lg ">
                About Eventy
            </h1>
            <p className="text-xl text-gray-700 mb-10 font-medium  delay-200">
                Eventy is your go-to platform for discovering, creating, and sharing amazing events. Our mission is to connect people through unforgettable experiences, making event planning and participation seamless and enjoyable.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center  delay-300">
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-2xl p-8 flex-1 border border-blue-100 hover:scale-105 transition-transform duration-300">
                <h2 className="text-2xl font-bold text-blue-700 mb-3">Our Vision</h2>
                <p className="text-gray-700">
                    To inspire communities by making events accessible, engaging, and memorable for everyone.
                </p>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-2xl p-8 flex-1 border border-purple-100 hover:scale-105 transition-transform duration-300">
                <h2 className="text-2xl font-bold text-purple-700 mb-3">Our Values</h2>
                <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Inclusivity</li>
                    <li>Innovation</li>
                    <li>Community</li>
                    <li>Transparency</li>
                </ul>
                </div>
            </div>
            <div className="mt-12 animate-fade-in delay-500">
                <a
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-xl hover:scale-105 hover:from-blue-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg"
                >
                Back to Home
                </a>
            </div>
            </section>
            {/* Removed <style jsx global> to fix Server Component error. Move fade-in keyframes and classes to globals.css. */}
        </main>
    );
}