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

      <div className="flex gap-8 p-2">
        <Sidebar />

        <main className="w-full overflow-x-hidden">
          <Header/>
            <StockCarouselForDashboard/>
          <Outlet />
          <Footer/>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
