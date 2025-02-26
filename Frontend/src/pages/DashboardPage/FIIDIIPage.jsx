import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { FcCandleSticks } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import CustomBarChart from "../../Components/Dashboard/FIIDIIchart";
import FiiDiiTable from "../../Components/Dashboard/FiiDiiTable";

const FIIDIIPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mt-8">FII/DII</h1>
      <section className="mt-8 dark:bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">
        <div className="dark:bg-db-primary bg-db-primary-light rounded-lg p-2">
          <div>
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-bold">FII/DII</h1>
              <span className="text-xl">
                <FcCandleSticks />
              </span>
              <span className="flex items-center px-2 py-px rounded-full w-fit bg-[#0256F5] text-xs text-white">
                <GoDotFill />
                Live
              </span>

              <span className="flex items-center gap-1">How to use <FaPlayCircle className="text-[#0256F5]"/></span>
            </div>

            <div className="mt-4 dark:bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">
                <CustomBarChart/>
            </div>


          </div>
        </div>
      </section>

      <section className="mt-8 dark:bg-gradient-to-br from-[#00078F] to-[#01071C] p-px rounded-lg">

            <FiiDiiTable/>
      </section>
    </>
  );
};

export default FIIDIIPage;
