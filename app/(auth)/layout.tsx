import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode; // Define the type for the `children` prop
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="flex justify-center pt-20 pb-5">{children}</div>;
};

export default layout;
