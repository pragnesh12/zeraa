import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, PenBox, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggleButton } from "./ui/ThemeToggleButton";
import { Button } from "./ui/button";
import UserMenu from "./user-menu";
import { UserCheck } from "@/lib/UserChecks";
import Loader from "./user-loading";

const navigation = [{ name: "Home", href: "/" }];

export const Header = async () => {
  await UserCheck();

  return (
    <>
      <header className="shadow-sm">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex items-center ml-[-8rem]">
              <Link href="/">
                <Image
                  src="/image.png"
                  className="h-8 w-auto"
                  width={100}
                  height={100}
                  alt="Zeraa"
                />
              </Link>
            </div>

            {/* Center Section: Navigation links */}
            <div className="hidden space-x-8 lg:flex">
              {/* {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? "text-indigo-800"
                      : "text-gray-300 hover:text-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))} */}
            </div>

            {/* Right Section: Sign In/Sign Up/User Button */}
            <div className="ml-10 space-x-4 sm:hidden md:inline mr-[-8rem] flex">
              <div className="flex ">
                <SignedOut>
                  <div className="mr-3">
                    <ThemeToggleButton />
                  </div>
                  <SignInButton>
                    <button className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-opacity-75 ">
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
              <div className="items-center mt-[10px] flex">
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

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden"></div>
          </div>
        </nav>
        <Loader />
      </header>
    </>
  );
};
