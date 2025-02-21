import React from 'react'
import StockCard from '../../Components/Dashboard/StockCard'
import meter from '../../assets/Images/Dashboard/marketdepthpage/meter.png'
import boost from '../../assets/Images/Dashboard/marketdepthpage/boost.png'
import dayHigh from '../../assets/Images/Dashboard/marketdepthpage/dayHigh.png'
import dayLow from '../../assets/Images/Dashboard/marketdepthpage/dayLow.png'
import topGainers from '../../assets/Images/Dashboard/marketdepthpage/topGainers.png'
import topLoosers from '../../assets/Images/Dashboard/marketdepthpage/topLoosers.png'

const MarketDepthPage = () => {
  const stockDataList = [
    {
      title: "High Power Stocks",
      img:meter,
      price: "purchased",
      stocks: [
        { symbol: "KPITTECH", icon: "https://via.placeholder.com/20/00FF00", percent: 2.96, turnover: 332.89 },
        { symbol: "ZOMATO", icon: "https://via.placeholder.com/20/FF0000", percent: 6.72, turnover: 1.94 },
        { symbol: "TVS MOTOR", icon: "https://via.placeholder.com/20/FFA500", percent: 5.94, turnover: 0.77 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
        { symbol: "SUPER MEIND", icon: "https://via.placeholder.com/20/FF4500", percent: 5.64, turnover: 1.89 },
      ],
    },
    {
      title: "Intraday Boost",
      img:boost,
      price: "purchased",
      stocks: [
        { symbol: "HDFC", icon: "https://via.placeholder.com/20/008000", percent: 1.23, turnover: 125.3 },
        { symbol: "ICICI", icon: "https://via.placeholder.com/20/FF4500", percent: 2.45, turnover: 76.5 },
        { symbol: "TATA STEEL", icon: "https://via.placeholder.com/20/0000FF", percent: 3.78, turnover: 56.1 },
      ],
    },
    {
      title: "Top Level Stocks",
      img: dayHigh,
      price: "no",
      stocks: [
        { symbol: "IRCTC", icon: "https://via.placeholder.com/20/800080", percent: 4.11, turnover: 98.2 },
        { symbol: "YES BANK", icon: "https://via.placeholder.com/20/FFD700", percent: 1.98, turnover: 23.4 },
        { symbol: "BIOCON", icon: "https://via.placeholder.com/20/FF69B4", percent: 3.22, turnover: 45.8 },
      ],
    },
    {
      title: "Low Level Stocks",
      img: dayLow,
      price: "no",
      stocks: [
        { symbol: "IRCTC", icon: "https://via.placeholder.com/20/800080", percent: 4.11, turnover: 98.2 },
        { symbol: "YES BANK", icon: "https://via.placeholder.com/20/FFD700", percent: 1.98, turnover: 23.4 },
        { symbol: "BIOCON", icon: "https://via.placeholder.com/20/FF69B4", percent: 3.22, turnover: 45.8 },
      ],
    },
    {
      title: "Top Gainers",
      img: topGainers,
      price: "no",
      stocks: [
        { symbol: "IRCTC", icon: "https://via.placeholder.com/20/800080", percent: 4.11, turnover: 98.2 },
        { symbol: "YES BANK", icon: "https://via.placeholder.com/20/FFD700", percent: 1.98, turnover: 23.4 },
        { symbol: "BIOCON", icon: "https://via.placeholder.com/20/FF69B4", percent: 3.22, turnover: 45.8 },
      ],
    },
    {
      title: "Top Loosers",
      img: topLoosers,
      price: "no",
      stocks: [
        { symbol: "IRCTC", icon: "https://via.placeholder.com/20/800080", percent: 4.11, turnover: 98.2 },
        { symbol: "YES BANK", icon: "https://via.placeholder.com/20/FFD700", percent: 1.98, turnover: 23.4 },
        { symbol: "BIOCON", icon: "https://via.placeholder.com/20/FF69B4", percent: 3.22, turnover: 45.8 },
      ],
    },
  ];
  return (
     <section>
        <h1 className='text-3xl font-medium mt-5'>Market Depth</h1>


        <div className='grid grid-cols-2 gap-6 w-full mt-10'>
          {
            stockDataList.map((item, index) => <StockCard key={index} title={item.title} stocks={item.stocks} img={item.img} price={item.price} />)
          }
        </div>
     </section>

  )
}

export default MarketDepthPage