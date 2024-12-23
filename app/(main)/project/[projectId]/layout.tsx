"use client";

import React, { Suspense } from "react";
import Loader from "@/components/user-loading";

const ProjectPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<span className="animate-pulse">{children}</span>}>
      <div className="mx-auto">{children}</div>
    </Suspense>
  );
};

export default ProjectPageLayout;
