// Home page for Eventy
// Displays hero section, event search/filter, and event collection

import CategoryFilter from "@/components/shared/CategoryFilter";
import { Collection } from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  // Resolve search parameters from URL
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || '';
  const category = (resolvedSearchParams?.category as string) || '';

  // Fetch events based on search/filter parameters
  const events = await getAllEvents({
    query: searchText,
    limit: 6,
    page: page,
    category: category
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Celebrate: Your Events, Our Platform</h1>
            <p className="p-regular-20 md:p-regular-24">
              Plan, manage, and share events effortlessly with Eventy.<br />
              Because every event deserves to shine.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="">Explore Now</Link>
            </Button>
          </div>

          {/* Hero Image */}
          <Image
            src="/assets/images/hero.png"
            alt="Hero"
            width={1500}
            height={1500}
            className="max-h-[70vh] mt-9 object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trusted by <br /> INSAT Clubs and Events</h2>

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
          page={Array.isArray(resolvedSearchParams?.page) ? resolvedSearchParams.page[0] || 1 : resolvedSearchParams?.page || 1}
          total={events?.totalPages || 0}
        />
      </section>
    </main>
  );
}
