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

<<<<<<< HEAD
<<<<<<< HEAD
      <div className="flex gap-8 p-2">
=======
      <div className="flex gap-8 mr-5">
>>>>>>> fb999db1f3e3c1a706564fa295bcfa391460cc34
=======
      <div className="flex gap-8 mr-5">
>>>>>>> fb999db1f3e3c1a706564fa295bcfa391460cc34
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
