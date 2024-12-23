import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto mt-8">{children}</div>;
}

export default Layout;
