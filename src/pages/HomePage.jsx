import React from "react";
import AiStar from "../assets/Images/AiIntegrationImg.png";
import AiStock from "../assets/Images/AiIntegrationStartImg.svg";
import DoorImg from "../assets/Images/DoorImg.svg";
import GearImg from "../assets/Images/GearImg.svg";
import Target from "../assets/Images/Target.svg";
import laptopImg from "../assets/Images/laptopImg.png";
import done from "../assets/Images/done.svg";
import { PiFireSimpleFill } from "react-icons/pi";
import { LuLogIn } from "react-icons/lu";
import AiPowerdCard from "../Components/AiPowerdCards";
import BenefitCards from "../Components/BenefitCards";
import TestimonialsCarousel from "../Components/TestimonialsCarousel";
const HomePage = () => {
  const Features = [
    "Market Depth",
    "Custom Strategy",
    "Sector Depth",
    "Ai Swing Trades",
    "Option Clock",
    "FII / DII Data",
    "Index Depth",
    "Trading Journal",
    "learn From Us",
    "Over Strategy",
    "Financial Calender",
    "Calculator",
  
  ];
  return (
    <>
      {/* hero section */}
      <div className="bg-[#02000e] w-full h-screen font-Inter ">
      <div class="blue-blur-circle"></div>
      <div className="flex flex-col items-center justify-center mt-40 space-y-12 w-[70%] mx-auto">
          <img src={AiStar} alt="" />
          <h1 className="text-primary font-extrabold text-6xl text-center">
            India’s First AI Stock Screener
          </h1>
          <p className="text-[#A6AAB2] font-sm text-center">
            Step into the world of trading excellence and seize every
            opportunity with our advanced platform, expert guidance, and
            strategic insights for unrivaled financial success.
          </p>
        </div>
        <div className="flex items-center justify-center w-1/2 mx-auto">
          <div className="grid grid-cols-2 mx-auto mt-10 gap-3">
            <div className="flex gap-2 items-center">
              <img src={AiStock} className="w-6 h-6 " />
              <p>AI stock selection algorithm</p>
            </div>
            <div className="flex gap-2 items-center">
              <img src={DoorImg} className="w-6 h-6 " />
              <p>Perfect Entry and Exit Strategies</p>
            </div>
            <div className="flex gap-2 items-center">
              <img src={GearImg} className="w-6 h-6 " />
              <p>Smooth Execution</p>
            </div>
            <div className="flex gap-2 items-center">
              <img src={Target} className="w-6 h-6 " />
              <p>Don’t Miss any opportunity</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-20 gap-4 ">
          <button className="text-xl bg-primary flex items-center gap-2 rounded-3xl px-3 py-2">
            <PiFireSimpleFill /> Buy Now
          </button>
          <button className="text-xl  flex items-center gap-2 rounded-3xl px-3 py-2 bg-[#0256F533] text-white border border-[#0A7CFF33] backdrop-blur-lg">
            <LuLogIn /> Login
          </button>
        </div>
      </div>

      {/* laptop img sectionF */}
      <div className="w-4/5 mx-auto">
        <img src={laptopImg} className="w-full" />
      </div>

      {/* AI Powered Features */}

      <div className="w-full mt-40 font-abcRepro">
        <h1 className="font-bold text-4xl mb-15">AI Powered Features</h1>
        <div className="grid grid-cols-4 gap-4">
          <AiPowerdCard />
        </div>
      </div>

      {/* TradingTantra Benefits - */}
      <div className="w-full mt-40 font-abcRepro">
        <h1 className="font-bold text-4xl mb-15">TradingTantra Benefits -</h1>
        <div className="grid grid-cols-3 gap-4">
          <BenefitCards />
        </div>
      </div>

      {/* crystal plan */}
      <div className="font-abcRepro flex flex-col items-center justify-center mt-40">
        <h2 className="text-4xl font-bold mb-10">Trust,Trade,Win,Boom</h2>
        <div className="bg-[url(./assets/Images/CrystalPlanImg.png)] w-[806px] h-[453px] max-auto rounded-3xl">
          <div className=" bg-[#000A2D66] text-white border border-[#0A7CFF33]  w-full h-full  rounded-4xl px-10 ">
            <div className="flex justify-between items-center  ">
              <div className="mt-10">
                <h4 className="uppercase font-bold text-5xl tracking-wider  ">
                  crystal
                </h4>
                <p className=" uppercase text-xl tracking-[16px] font-light">
                  Plan
                </p>
              </div>
              <div>
                <div className="space-y-4 rounded-b-2xl bg-[#0257f567] px-10 py-7    flex flex-col items-center">
                  <p className="text-xl font-black">Validity = 6 Months </p>
                  <p className="text-3xl font-bold">+</p>
                  <p className="text-2xl font-black">6 Months Free</p>
                </div>
                <p className="text-center mt-3 text-2xl font-thin">
                  Limited Offer
                </p>
              </div>
            </div>
            <div>
              <p className="text-2xl tracking-[13px]">Total</p>
              <p className="text-6xl font-extrabold text-primary">₹ 3,999</p>
            </div>
            <button className="w-full h-15 bg-primary rounded-lg mt-10 text-2xl">
              Buy Now
            </button>
          </div>
        </div>

        <h2 className="font-bold text-3xl mt-10 ">Unlock Everything with Tutorial Videos</h2>
        <div className="grid grid-cols-3 gap-y-5 gap-x-10 w-3/4 mx-auto ml-67 mt-10">
          {Features.map((item,index)=>(
          <div className="flex items-center gap-4">
            <img src={done}  className="w-6 h-6 "/>
            <p className="text-base font-light">{item}</p>
          </div>
          ))}
        </div>
      </div>

      {/* testimonial */}

      <div>
          <h4 className="font-bold text-3xl text-center mt-40">Testmonial</h4>
          <div className="w-full mt-20">
            <TestimonialsCarousel/>
          </div>
      </div>
    </>
  );
};

export default HomePage;
