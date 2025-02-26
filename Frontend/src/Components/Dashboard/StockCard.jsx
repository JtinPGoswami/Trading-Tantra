import React from "react";
import { FaLock, FaPlay, FaPlayCircle, FaSearch } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FcCandleSticks } from "react-icons/fc";
import { RiLockFill } from "react-icons/ri";

const StockCard = ({ title, stocks, img, price }) => {
  return (
    <div className=" relative w-full h-[360px] bg-gradient-to-tr from-[#0009B2] to-[#02000E] rounded-lg p-px overflow-hidden">
      <div className="w-full h-full   dark:bg-db-primary bg-db-primary-light rounded-lg p-2  ">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
           {img &&  <img src={img} alt="Logo" className="w-12 h-12 object-contain" />}
            <div>
              <h2 className=" text-xl font-semibold flex items-center gap-2">{title} <FcCandleSticks/></h2>
              <p className="dark:text-gray-400 text-sm flex items-center gap-2">
                How to use <FaPlayCircle className="text-[#0256F5]" />{" "}
                <span className="bg-blue-600  px-2 py-1 rounded-full text-xs">
                  Live
                </span>
              </p>
            </div>
          </div>

          <button className="p-2 rounded-lg   transition bg-gradient-to-b from-[#085AF5] to-[#73A3FE]">
            <FaSearch  />
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-gradient-to-bl  from-[#00078F] to-[#01071C] p-px h-fit mt-4 rounded-lg">
          <div className=" w-full  rounded-lg dark:bg-db-secondary bg-db-secondary-light  p-2 relative">
            {/* lock container */}
            <div className={`dark:bg-[#000A2D80]/50  bg-[#273D8F30]/90 rounded-lg flex backdrop-blur-xs absolute z-20 w-full h-full top-0 left-0  justify-center items-center ${price === "purchased" ? "hidden": ""} `}>
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0256F5" />
                    <stop offset="100%" stopColor="#77A6FF" />
                  </linearGradient>
                </defs>
                <RiLockFill size={34} fill="url(#gradient)" />
              </svg>
            </div>
            {/* Scrollable wrapper */}
            <div className="h-[260px] overflow-y-auto rounded-lg scrollbar-hidden  ">
              <table className="w-full ">
                {/* Table Header */}
                <thead className="sticky top-0 dark:bg-db-secondary bg-db-secondary-light z-10  ">
                  <tr className="text-gray-300 ">
                    <th className="flex justify-start items-center py-2">
                      Symbol <MdOutlineKeyboardArrowDown />
                    </th>
                    <th className="py-2">
                      <MdOutlineKeyboardArrowDown />
                    </th>
                    <th className=" py-2 flex items-center justify-center">
                      % <MdOutlineKeyboardArrowDown />
                    </th>
                    <th className="text-right py-2">T.O. </th>
                  </tr>
                  <tr className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#000A2D] via-[#002ED0] to-[#000A2D] " />
                </thead>

                {/* Scrollable Table Body */}
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr key={index}>
                      <td className="flex items-center font-medium text-xs gap-2 py-3">
                        <img
                          src={stock.icon}
                          alt={stock.symbol}
                          className="w-5 h-5"
                        />
                        {stock.symbol}
                      </td>
                      <td className="text-lg">
                        <FcCandleSticks />
                      </td>
                      <td className="text-center">
                        <span className="bg-blue-600 px-2 py-1 text-xs rounded-full">
                          {stock.percent.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right text-xs">{stock.turnover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
