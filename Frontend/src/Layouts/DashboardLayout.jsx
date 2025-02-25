import React, { useEffect } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Components/Dashboard/Header";
import StockCarouselForDashboard from "../Components/Dashboard/StockCarouselForDashboard";
import Footer from "../Components/Web/Footer";
import { useSelector } from "react-redux";

const DashboardLayout = () => {

  const theme = useSelector((state) => state.theme.theme);

  console.log(theme)
  useEffect(() => {
if(theme==="dark"){
  document.body.style.backgroundColor = "#02000E";
  document.body.style.color = "#fff";
}else{
  document.body.style.backgroundColor = "#f8faff";
  document.body.style.color = "#000";
}

  }, [theme]);

  return (
    <>
      <div className="flex h-screen w-screen gap-8 px-2 ">
        <aside>
          <Sidebar />
        </aside>

        <main className="w-full overflow-y-auto overflow-x-hidden scrollbar-hidden transition-all duration-300 ease-linear">
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
