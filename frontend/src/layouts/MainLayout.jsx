import React from "react";

const MainLayout = ({ header, children, footer }) => {
  return (
    <div>
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
};

export default MainLayout;
