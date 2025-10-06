"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { headerLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import type { UserType } from "@/types";

export const NavItems = () => {
  const pathname = usePathname();
  const { user } = useUser();

  // Read user type from Clerk public metadata (set via webhook)
  const rawType = user?.publicMetadata?.type as unknown;
  const userType: UserType | undefined =
    rawType === "club" || rawType === "student"
      ? (rawType as UserType)
      : undefined;

  // Only show "Create Event" to club users
  const visibleLinks = headerLinks.filter((link) =>
    link.label === "Create Event" ? userType === "club" : true
  );

  const isClub = userType === "club";

  return (
    <ul
      className={cn(
        "flex w-full flex-col md:flex-row md:items-center",
        isClub ? "md:justify-between gap-5" : "md:justify-center gap-5"
      )}
    >
      {visibleLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={cn(
              "flex-center p-medium-16 whitespace-nowrap transition-colors duration-300 ease-in-out",
              isActive
                ? "text-primary-500"
                : "text-white hover:text-primary-500"
            )}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};
