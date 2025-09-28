import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { NavItems } from "./NavItems";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="w-full bg-transparent ">
      <div className="wrapper py-3">
        <div className="mx-auto flex items-center justify-between rounded-full border border-white/40 bg-white/5 px-4 py-5 backdrop-blur-md shadow-sm max-w-4xl text-white  transition-shadow duration-200 hover:shadow-[0_0_16px_1px_rgba(255,255,255,0.5)] ">
          <Link href="/" className="w-36 pl-2">
            <Image
              src="/logos/eventia-wh-lg.png"
              alt="EventlyLogo"
              width={118}
              height={39}
            />
          </Link>

          <SignedIn>
            <nav className="md:flex-between hidden w-full max-w-xs items-center text-white">
              <NavItems />
            </nav>
          </SignedIn>

          <div className="flex w-32 justify-end gap-3 pr-5">
            <SignedIn>
              <UserButton />
              <MobileNav />
            </SignedIn>
            <SignedOut>
              <Button
                asChild
                className="rounded-full transition-shadow duration-300 hover:shadow-[0_0_16px_4px_rgba(255,255,255,0.5)]"
                size="lg"
              >
                <Link href="/sign-in" className="text-white">
                  Login
                </Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
