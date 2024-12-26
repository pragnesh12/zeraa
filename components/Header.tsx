"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { PenBox } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";
import Loader from "./user-loading";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check for window width in the browser
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state and listen for resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className="shadow-sm border-b-gray border-b-2">
        <nav
          className="mx-auto max-w-auto px-4 sm:px-6 md:px-8 lg:px-8"
          aria-label="Top"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex items-center ">
              <Link href="/">
                {!isMobile ? (
                  <Image
                    src="/image.png"
                    className="h-8 w-auto"
                    width={100}
                    height={100}
                    alt="Zeraa"
                  />
                ) : (
                  <Image
                    src="/newImageLogo.jpg"
                    className="h-8 w-auto"
                    width={100}
                    height={100}
                    alt="Zeraa"
                  />
                )}
              </Link>
            </div>

            {/* Right Section: Sign In/Sign Up/User Button */}
            <div className="ml-10 space-x-4 sm:hidden md:inline flex items-center pt-[-10rem]">
              <div>
                <SignedOut>
                  {/* <div className="mr-3">
                    <ThemeToggleButton />
                  </div> */}
                  <SignInButton>
                    <button className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-opacity-75 ">
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
              <div className="items-center flex">
                <SignedIn>
                  {/* <div className="mr-3">
                      <ThemeToggleButton />
                    </div> */}
                  <div className="mr-3">
                    <Link href="/project/create">
                      <Button className="items-center bg-red-600 text-white hover:text-white hover:bg-red-400 gap-2">
                        <PenBox size={18} />
                        Create Project
                      </Button>
                    </Link>
                  </div>
                  <UserMenu />
                </SignedIn>
              </div>
            </div>
          </div>
        </nav>
        <Loader />
      </header>
    </>
  );
};

export default Header;
