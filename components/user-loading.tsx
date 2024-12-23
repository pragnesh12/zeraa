"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";

const Loader = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isLoaded && !isUserLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Loader;
