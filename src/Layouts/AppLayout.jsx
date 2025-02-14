import React, { useEffect } from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";

const AppLayout = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#02000E";
    document.body.style.color = "#fff";
  }, []);

  return (
    <>
      <Header />
      <main className="w-full px-[5%] cursor-default">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
