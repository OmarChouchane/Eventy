// Home page for Eventy
// Displays hero section, event search/filter, and event collection

import CategoryFilter from "@/components/shared/CategoryFilter";
import { Collection } from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Header from "@/components/shared/Header";
import BlurText from "@/components/BlurText";
import Particles from "@/components/Particles";
import LogoLoop from "@/components/LogoLoop";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

import Link from "next/link";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
];

export default async function Home({ searchParams }: SearchParamProps) {
  // Resolve search parameters from URL
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || "";
  const category = (resolvedSearchParams?.category as string) || "";

  // Fetch events based on search/filter parameters
  const events = await getAllEvents({
    query: searchText,
    limit: 6,
    page: page,
    category: category,
  });

  return (
    <main>
      {/* Hero Section */}
      <div style={{ width: "100%", height: "800px", position: "relative" }}>
        <section
          className="h-full bg-black bg-gradient-to-b from-black via-gray-900 to-black bg-contain py-5 md:py-10"
          style={{ position: "relative", overflow: "hidden" }}
        >
          {/* Particles as background */}
          {/* Make sure the Particles layer covers everything and allows pointer events to pass through */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0, pointerEvents: "none" }}
          >
            <Particles
              particleColors={["#ffffff", "#888888"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
            />
          </div>
          <Header />

          <div
            className="wrapper flex flex-col justify-center items-center gap-8 text-center"
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              justifyContent: "flex-start",
              paddingTop: "100px",
            }}
          >
            <BlurText
              text="INSAT’s Hub for Events, Clubs, and Campus Life"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-6xl md:text-6xl font-extrabold text-white mx-auto text-center leading-tight block w-full"
            />

            <BlurText
              text="Eventia brings together INSAT students and clubs in one platform"
              delay={150}
              animateBy="words"
              direction="top"
              className="mt-6 p-regular-20 md:p-regular-18 text-gray-100 w-full max-w-2xl -mb-8"
            />
            <BlurText
              text="Organize, discover, and experience events like never before."
              delay={150}
              animateBy="words"
              direction="top"
              className="p-regular-20 md:p-regular-18 text-gray-100 w-full max-w-2xl"
            />

            <Button
              size="lg"
              asChild
              className="button mt-8 w-full sm:w-fit text-black bg-white hover:border-white/40 hover:backdrop-blur-xl shadow-sm border hover:bg-white/5 hover:text-white border-transparent
              relative overflow-hidden
              before:content-[''] before:absolute before:inset-0 before:rounded-lg
              before:bg-white before:opacity-5 before:blur-[18px] before:animate-pulse
              "
              style={{
              boxShadow: "0 0 16px 2px #fff6, 0 0 32px 4px #38bdf866",
              }}
            >
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Events Section */}
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by <br /> INSAT Clubs and Events
        </h2>
        <div
          style={{
            height: "200px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>

        {/* Search and Category Filter */}
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        {/* Events Collection */}
        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={3}
          page={
            Array.isArray(resolvedSearchParams?.page)
              ? resolvedSearchParams.page[0] || 1
              : resolvedSearchParams?.page || 1
          }
          total={events?.totalPages || 0}
        />
      </section>
    </main>
  );
}
