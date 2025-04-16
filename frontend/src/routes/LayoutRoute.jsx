import React from "react";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const LayoutRoute = ({ element }) => {
  return (
    <MainLayout header={<Header />} footer={<Footer />}>
      {element}
    </MainLayout>
  );
};

export default LayoutRoute;
