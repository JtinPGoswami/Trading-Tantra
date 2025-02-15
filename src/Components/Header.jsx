import React from "react";
import logo from "../assets/Images/logo.svg";
import { GiHamburgerMenu } from "react-icons/gi";
const Header = () => {
  return (
    <header className="w-full mt-5 absolute top-0 z-20 mx-auto flex justify-between items-center text-white xl:px-20 px-10">
      {/* logo */}

      <div className="xl:w-auto lg:w-42 sm:w-40 w-30">
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
      <div className="flex sm:gap-5 gap-4">
        <button className="sm:text-base text-sm">Login</button>
        <button className="neon-button sm:text-base text-sm bg-black cursor-pointer font-semibold px-6 py-3 rounded-[20px]">Buy Now</button>
      </div>
    </header>
  );
};

export default Header;
