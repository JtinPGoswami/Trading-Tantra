import React from "react";

import marketDepth from '../../assets/Images/Dashboard/homepage/marketDepth.png'
import customStrategy from '../../assets/Images/Dashboard/homepage/customer-strategy.png'
import sectorDepth from '../../assets/Images/Dashboard/homepage/sector-depth.png'
import AiSwing from '../../assets/Images/Dashboard/homepage/AI-swing.png'
import clock from '../../assets/Images/Dashboard/homepage/clock.png'
import profit from '../../assets/Images/Dashboard/homepage/profit.png'
import graph from '../../assets/Images/Dashboard/homepage/graph.png'
import learnBook from '../../assets/Images/Dashboard/homepage/learn-book.png'
import overStrategy from '../../assets/Images/Dashboard/homepage/over-strategy.png'
const Card = ({ title, description, buttonText, icon }) => {
  return (
    <div className="dark:bg-db-primary bg-db-primary-light   border border-transparent rounded-xl p-4 relative shadow-lg"
      style={{
        borderImage: "linear-gradient(180deg, #0256F5, #02000E) 1",
      }}
    >
      <div className="flex flex-col items-start space-x-3">
        <div className="flex items-center gap-3">
        <div >
          <img className="w-12 h-12  " src={icon} alt={title} />
        </div>

        <h2 className=" font-semibold text-lg">{title}</h2>
        </div>
        <div>
        
          <p className="dark:text-gray-400 text-gray-800 text-sm mt-5">{description}</p>
        </div>
      </div>
      <button className="w-full bg-[#0256F5] text-white mt-4 py-2 rounded-md font-medium">
        {buttonText}
      </button>
    </div>
  );
};

const MarketSection = () => {
  const cards = [
    {
      title: "Market Depth",
      description: "It identifies stocks where the big players are actively building positions.",
      buttonText: "Market Depth",
      icon: marketDepth,
    },
    {
      title: "Customer Strategy",
      description: '"Customer Strategy" analyzes stocks based on proven market structures.',
      buttonText: "Customer Strategy",
      icon: customStrategy,
    },
    {
      title: "Sector Depth",
      description: "Perfect for traders aiming for high-profit trades with pinpoint accuracy.",
      buttonText: "Sector Depth",
      icon: sectorDepth,
    },
    {
      title: "Ai Swing Traders",
      description: "Find best stocks for swing trading based on different strategies.",
      buttonText: "Ai Swing Traders",
      icon:AiSwing,
    },
    {
      title: "Option Clock",
      description: "Just select time and get position built up by big players.",
      buttonText: "Option Clock",
      icon: clock,
    },
    {
      title: "Profit",
      description: "Trading profit is earnings from core business activities before deductions.",
      buttonText: "Market Depth",
      icon: profit,
    },
    {
      title: "Index Mover",
      description: '"Index Depth" shows which stocks are the driving forces behind index movements.',
      buttonText: "Index Mover",
      icon: graph,
    },
    {
      title: "Learn From Us",
      description: "Take maximum benefits of Trade Tantra & learn how to use different features.",
      buttonText: "Learn More",
      icon: learnBook,
    },
    {
      title: "Over Strategy",
      description: "Take maximum benefits of TradeFinder & learn how to use different features.",
      buttonText: "Over Strategy",
      icon: overStrategy,
    },
  ];

  return (
    <div className="dark:bg-db-primary min-h-screen px-6 py-10">
      <h1 className=" text-2xl font-bold mb-6">Indian Markets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MarketSection;
