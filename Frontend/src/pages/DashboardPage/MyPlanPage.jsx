import React, { useState } from "react";
import ProfileHeader from "../../Components/Dashboard/ProfileHeader";

const MyPlanPage = () => {
  const [activeTab, setActiveTab] = useState("Active Plan");
  return (
    <>
      <div className="mt-10">
        <ProfileHeader />
      </div>

      <div className="bg-[#01071C] rounded-[20px] max-w-lg mx-auto  py-6 h-full ">
        <div>
          <h3 className="text-xl font-semibold px-6 py-2">My Plan</h3>

          <div className="w-full space-x-4 text-xs mt-9 text-[#C9CFE5] px-6 border-b border-[#26304A]">
            <button className={`p-2 cursor-pointer ${activeTab === "Active Plan" && " border-b-2 border-[#0155F3]"}`} onClick={() => setActiveTab("Active Plan")}>
              Active Plan
            </button>
            <button className={`p-2 cursor-pointer ${activeTab === "All Plan" && " border-b-2 border-[#0155F3]"}`} onClick={() => setActiveTab("All Plan")}>
              All Plan
            </button>
          </div>
        </div>

        <ul>
          {activeTab === "Active Plan" ? (
            <li className="px-6 py-2 flex justify-between items-center border-b border-[#26304A]">
              <div>
                <h4 className="text-xl font-semibold">Diamonds</h4>
                <p className="font-light">Valid till: 07 January, 2026</p>
                <p className="font-light text-[#0155F3]">
                  View Transaction Details
                </p>
              </div>

              <button className="bg-[#0155F3] font-light py-2 px-2.5 h-fit rounded">
                Renew
              </button>
            </li>
          ) : (
            <li className="px-6 py-2 border-b border-[#26304A] flex justify-between items-center">
              <div>
                <h4 className="text-xl font-semibold">Diamonds</h4>
                <p className="font-light">Valid till: 07 January, 2027</p>
                <p className="font-light text-[#0155F3]">
                  View Transaction Details
                </p>
              </div>

              <button className="bg-[#0155F3] font-light py-2 px-2.5 h-fit rounded">
                Renew
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MyPlanPage;
