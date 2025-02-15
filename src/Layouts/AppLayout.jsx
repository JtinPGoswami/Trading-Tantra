import React, { useEffect } from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Lenis from "@studio-freight/lenis";
import StockCarousel from "../Components/StockCarousel";

const AppLayout = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#02000E";
    document.body.style.color = "#fff";

    const lenis = new Lenis({
      duration: 3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: false, 
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy(); // Cleanup on unmount
  }, []);

  return (
    <>
  <StockCarousel/>
      <Header />
      <main className="w-full px-[5%] cursor-default">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
