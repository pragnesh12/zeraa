import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-white ">
      <h1 className="text-6xl font-extrabold mb-4 ">404</h1>
      <p className="text-xl  mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/">
        <Button className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
