import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import user from "../../assets/Images/Dashboard/HeaderImg/user.png";
const Header = () => {
  return (
    <div className="bg-[#000517] border border-[#000B34] h-20 w-full mx-auto rounded-2xl p-3 flex items-center justify-between ">
      <div className="w-1/2">
        <button className="bg-gradient-to-b from-[#0256F5] to-[#74A4FE] text-white px-4 py-2 rounded-lg">
          Go to Website
        </button>
      </div>
      <div className="w-1/2 flex justify-end gap-2 items-center">
        <div className="bg-[#000A2D] border border-[#0256F5] px-2 py-3 flex ">
          <input
            type="text"
            name=""
            id=""
            className="outline-none border-none"
          />
          <FaSearch />
        </div>
        <button className="bg-gradient-to-b from-[#0256F5] to-[#74A4FE] text-white px-4 py-2 rounded-lg">
          theme
        </button>

        <IoIosNotifications className="text-white" />
        <img src={user} className="w-10 h-10 rounded-sm" alt="" />
      </div>
    </div>
  );
};

export default Header;
