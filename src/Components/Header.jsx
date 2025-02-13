import React from "react";
import logo from "../assets/Images/logo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
const Header = () => {
  return (
    <header className="w-full mt-5 absolute top-0 z-20 mx-auto flex justify-between items-center text-white xl:px-20 px-10">
      {/* logo */}

      <div className="xl:w-auto lg:w-42 w-40">
        <img src={logo} alt="logo" />
      </div>

      {/* navigations */}
      <nav className="bg-[#0256F533] text-white px-[26px] py-[13px] rounded-[50px] lg:block hidden border border-[#0A7CFF33] backdrop-blur-lg ">
        <ul className="flex  xl:gap-10 lg:gap-5 gap-3 text-base font-normal uppercase">
          <li className="cursor-pointer hover:text-primary transition-all duration-300">
            Home
          </li>
          <li className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center ">
            Updates{" "}
          </li>
          <li className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center ">
            Testimonal
          </li>
          <li className="cursor-pointer hover:text-primary transition-all duration-300">
            FAQ
          </li>
          <li className="cursor-pointer hover:text-primary transition-all duration-300">
            About Us
          </li>
          <li className="cursor-pointer hover:text-primary transition-all duration-300">
            Contact Us
          </li>
        </ul>
      </nav>

      {/* buttons */}
      <div className="flex sm:gap-5 gap-2">
        <button className="sm:text-base text-sm">Login</button>

        {/* <div className="button-wrapper p-1 sm:text-base text-sm rounded-3xl">
          <button className="buy-now-button opacity-50 sm:px-4 px-2   py-2 rounded-3xl">Buy Now</button>
        </div>
        <div className="lg:hidden bloack mt-3">
          <GiHamburgerMenu className=" text-3xl" />
        </div> */}
        <button className="neon-button">Buy Now</button>
      </div>
    </header>
  );
};

export default Header;
