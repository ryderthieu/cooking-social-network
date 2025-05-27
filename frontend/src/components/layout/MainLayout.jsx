import React from "react";
import Header from "./Header"
import Footer from "./Footer"

const MainLayout = ({children}) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header className="mb-20"/>
        <main className="pt-[110px] flex-grow">
            {children}
        </main>
        <Footer className="mt-[100px]"/>
      </div>
    </>
  )
};

export default MainLayout;
