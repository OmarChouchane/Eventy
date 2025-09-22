import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-gradient-to-tr from-[#0a1437]/95 via-[#1a237e]/90 to-[#00007c]/80 text-gray-200 shadow-2xl shadow-gray-900/40 rounded-t-3xl backdrop-blur-xl bg-opacity-95">
      <div className="wrapper mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/e-wh.ico"
              alt="Evently Logo"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-xl font-bold text-white  sm:inline">
              Eventy
            </span>
          </Link>
        </div>
        <nav className="flex gap-6 text-sm justify-center sm:justify-center w-full md:mr-8 sm-mr-0">
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/#events" className="hover:text-white transition">
            Events
          </Link>
          <Link href="/" className="hover:text-white transition">
            Contact
          </Link>
          <Link href="/" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </nav>
        <div className="flex items-center mr-5">
          <a
            href="https://github.com/OmarChouchane/Eventy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg
              className="w-5 h-5 hover:text-white transition"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.7.11 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48C19.13 20.54 22 16.74 22 12.26 22 6.58 17.52 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-6 py-4 text-center text-xs text-gray-300">
        &copy; {new Date().getFullYear()} Eventy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
