import React, { useEffect } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Components/Dashboard/Header";
import StockCarouselForDashboard from "../Components/Dashboard/StockCarouselForDashboard";
import Footer from "../Components/Web/Footer";

const DashboardLayout = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#02000E";
    document.body.style.color = "#fff";
  }, []);

  return (
    <>
      <div className="flex h-screen w-screen md:gap-5 gap-0 px-2 ">
        <aside >
          <Sidebar />
        </aside>

        <main className="w-full overflow-y-auto overflow-x-hidden scrollbar-hidden">
          <Header />
          <StockCarouselForDashboard />
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
