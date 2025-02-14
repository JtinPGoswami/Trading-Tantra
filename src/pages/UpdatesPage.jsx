import React from "react";

const UpdatesPage = () => {
  const updates = [
    {
      date: "2025-01-27",
      type: "Release",
      desc: "Intraday Boost Filters 🔥🔥 Now filter out stocks in Intraday Boost to find pinpoints stocks to trade in Intraday.",
    },
    {
      date: "2025-01-21",
      type: "Improvement",
      desc: "R. Factor is supercharged! 🚀 We rebuilt it from the ground up to find the best momentum stocks. Get ready for a whole new level of results,starting today!",
    },
    {
      date: "2024-10-19",
      type: "Update",
      desc: "After thorough backtesting, updated the core engine behind Contraction BO stocks in Insider Strategies for better results and accuracy for all the users.",
    },
    {
      date: "2025-01-27",
      type: "Release",
      desc: "Intraday Boost Filters 🔥🔥 Now filter out stocks in Intraday Boost to find pinpoints stocks to trade in Intraday.",
    },
    {
      date: "2025-01-21",
      type: "Improvement",
      desc: "R. Factor is supercharged! 🚀 We rebuilt it from the ground up to find the best momentum stocks. Get ready for a whole new level of results,starting today!",
    },
    {
      date: "2024-10-19",
      type: "Update",
      desc: "After thorough backtesting, updated the core engine behind Contraction BO stocks in Insider Strategies for better results and accuracy for all the users.",
    },
  ];
  return (
    <>
      <div className="bg-[url(./assets/Images/heroImg.png)]  w-[90%] h-[360px] mx-auto object-center bg-no-repeat my-35 flex items-center justify-center ">
      <div class="blue-blur-circle"></div>

        <h1 className="text-6xl font-abcRepro font-bold">Updates</h1>
      </div>

      <div className="w-full h-auto p-10 border-2 border-[#0256F5] rounded-lg">
        {updates.map((item, index) => (
          <div key={index} className=" py-5 flex items-center justify-start gap-8 border-b border-b-[#013AA6]">
            <p>{item.date}</p>
            {item.type === "Release" && (
              <p className="text-[#03071B] text-xs w-30 bg-[#6E9FFE] p-2 text-center rounded-lg">
                {item.type}
              </p>
            )}
            {item.type === "Improvement" && (
              <p className="text-white text-xs w-30 bg-[#151B2D] p-2 text-center rounded-lg">
                {item.type}
              </p>
            )}
            {item.type === "Update" && (
              <p className=" text-xs bg-primary w-30 p-2 text-center rounded-lg">
                {item.type}
              </p>
            )}
            <p className="text-sm text-[#FFFFFF80] text-wrap">{item.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpdatesPage;
