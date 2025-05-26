import React from "react";

const MainLayout = ({ header, children, footer }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {header}
      <main className="flex-1 mt-[70px]">{children}</main>
      {footer}
    </div>
  );
};

export default MainLayout;
