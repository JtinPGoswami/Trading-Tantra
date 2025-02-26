import React, { useState, useEffect, useRef } from "react";
import CalendarGrid from "../../Components/Dashboard/CalenarGrid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

const TradingJournal = () => {
  const [date, setDate] = useState(new Date());
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [dateRangeType, setDateRangeType] = useState("long");
  const [showDateRange, setShowDateRange] = useState(false);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: today,
    endDate: today,
  });
  const [tempDates, setTempDates] = useState({
    startDate: today,
    endDate: today,
  });
  const [tradeData, setTradeData] = useState({
    entryDate: today,
    exitDate: today,
    symbol: "",
    entryPrice: "",
    exitPrice: "",
    quantity: "",
    image: null,
  });

  const dateRangeRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const addTradeRef = useRef(null);

  const selectedMonthIndex = selectedDate.month
    ? new Date(`${selectedDate.month} 1, 2024`).getMonth()
    : today.getMonth();
  const selectedYear = selectedDate.year || today.getFullYear();

  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

  const handleDateChange = (e, type) => {
    const newDate = new Date(e.target.value);
    if (type === "start") {
      const diff = tempDates.endDate - newDate;
      if (diff < 0) {
        setTempDates({ startDate: newDate, endDate: newDate });
      } else if (diff > ONE_YEAR) {
        setTempDates({
          startDate: newDate,
          endDate: new Date(newDate.getTime() + ONE_YEAR),
        });
      } else {
        setTempDates({ ...tempDates, startDate: newDate });
      }
    } else {
      const diff = newDate - tempDates.startDate;
      if (diff < 0) {
        setTempDates({ startDate: newDate, endDate: newDate });
      } else if (diff > ONE_YEAR) {
        setTempDates({
          startDate: new Date(newDate.getTime() - ONE_YEAR),
          endDate: newDate,
        });
      } else {
        setTempDates({ ...tempDates, endDate: newDate });
      }
    }
  };

  const handleTradeDateChange = (e, field) => {
    setTradeData({ ...tradeData, [field]: new Date(e.target.value) });
  };

  const handleTradeInputChange = (e) => {
    const { name, value } = e.target;
    setTradeData({ ...tradeData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setTradeData({ ...tradeData, image: e.target.files[0] });
  };

  const handleApply = () => {
    setDateRange({
      startDate: tempDates.startDate,
      endDate: tempDates.endDate,
    });
    setShowDateRange(false);
  };

  const handleAddTradeSubmit = () => {
    console.log("Trade submitted:", tradeData);
    setShowAddTrade(false);
    // Here you can add logic to save the trade data (e.g., to a database or state management)
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Handle click outside for both date range and add trade
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setShowDateRange(false);
      }
      if (addTradeRef.current && !addTradeRef.current.contains(event.target)) {
        setShowAddTrade(false);
      }
    };

    if (showDateRange || showAddTrade) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateRange, showAddTrade]);

  // Open calendar on input click
  const handleInputClick = (ref) => {
    ref.current.showPicker();
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-semibold text-3xl my-5">Trading Journal</h1>

      <div className="flex justify-between items-center mb-5">
        <button className="text-sm px-3 py-2 border border-primary text-primary rounded-[5px]">
          How To Use Trading Journal?
        </button>
        <div className="flex gap-2.5">
          <div className="relative">

         
          <button
            className="text-sm font-normal bg-[#72A3FE] rounded-[5px] py-2 px-3"
            onClick={() => setShowAddTrade(!showAddTrade)}
          >
            Add Trade (+)
          </button>
          {showAddTrade && (
            <div
              ref={addTradeRef}
              className="absolute  top-15 -right-25 shadow-md w-[600px] z-50 rounded-md dark:bg-db-primary bg-db-secondary-light p-7 "
            >
              <div className="flex justify-between">
                <h3 className="text-2xl font-medium">Add Trade :</h3>
                <span
                  onClick={() => setShowAddTrade(false)}
                  className="text-2xl font-extrabold cursor-pointer"
                >
                  X
                </span>
              </div>
              <div className="mt-10">
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Select Date Range* :</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-base cursor-pointer"
                      onClick={() => setDateRangeType("long")}
                    >
                      Long
                    </div>
                    <div
                      onClick={() =>
                        setDateRangeType(() =>
                          dateRangeType === "short" ? "long" : "short"
                        )
                      }
                      className="w-14 h-6 dark:bg-[#00114e] bg-primary-light rounded-[5px] flex items-center p-1 cursor-pointer transition-all"
                    >
                      <div
                        className={`w-6 h-6 bg-primary rounded-[5px] shadow-md transform transition-all ${
                          dateRangeType === "short" ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                    <div
                      className="text-base cursor-pointer"
                      onClick={() => setDateRangeType("short")}
                    >
                      Short
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Entry Date & Time* :</p>
                  <input
                    ref={startInputRef}
                    type="date"
                    value={formatDateForInput(tradeData.entryDate)}
                    onChange={(e) => handleTradeDateChange(e, "entryDate")}
                    onClick={() => handleInputClick(startInputRef)}
                    className="dark:bg-[#00114E] bg-primary-light dark:placeholder:text-[#C9CFE5] placeholder:text-white text-white  rounded-sm px-3 py-1 w-[60%]"
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Exit Date & Time* :</p>
                  <input
                    ref={endInputRef}
                    type="date"
                    value={formatDateForInput(tradeData.exitDate)}
                    onChange={(e) => handleTradeDateChange(e, "exitDate")}
                    onClick={() => handleInputClick(endInputRef)}
                    className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%] dark:placeholder:text-[#C9CFE5] placeholder:text-white text-white "
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Symbol/Ticker* :</p>
                  <input
                    type="text"
                    name="symbol"
                    value={tradeData.symbol}
                    onChange={handleTradeInputChange}
                    className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%] dark:placeholder:text-[#C9CFE5] placeholder:text-white "
                    placeholder="Enter symbol/ticker"
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">
                    Entry Price*
                 :
                  </p>
                  <input
                    type="number"
                    name="entryPrice"
                    value={tradeData.entryPrice}
                    onChange={handleTradeInputChange}
                    className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%] dark:placeholder:text-[#C9CFE5] placeholder:text-white "
                    placeholder="Enter entry price"
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Exit Price*  :</p>
                  <input
                    type="number"
                    name="exitPrice"
                    value={tradeData.exitPrice}
                    onChange={handleTradeInputChange}
                    className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%] dark:placeholder:text-[#C9CFE5] placeholder:text-white "
                    placeholder="Enter exit price"
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Quantity* :</p>
                  <input
                    type="number"
                    name="quantity"
                    value={tradeData.quantity}
                    onChange={handleTradeInputChange}
                    className="dark:bg-[#00114E] dark:placeholder:text-[#C9CFE5] placeholder:text-white  bg-primary-light rounded-sm px-3 py-1 w-[60%]"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="flex items-center mb-5 justify-between w-full">
                  <p className="text-lg font-normal">Upload Image* :</p>
                  <label className="bg-primary text-white rounded-md pl-3 h-8 cursor-pointer w-[50%] flex justify-between items-center">
                    <span>Choose File</span>
                    <span className="dark:bg-[#00114E] bg-primary-light h-full text-center flex items-center px-2 rounded-r-md ">
                      {tradeData.image
                        ? tradeData.image.name
                        : "No File Chosen"}
                    </span>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <button
                className="bg-primary w-full text-white rounded-md py-2 mt-10"
                onClick={handleAddTradeSubmit}
              >
                Submit
              </button>
            </div>
          )} </div>
          <div className="relative">

         
          <button
            className="text-sm font-normal flex items-center gap-2 bg-[#0256F5] rounded-[5px] py-2 px-3"
            onClick={() => setShowDateRange(!showDateRange)}
          >
            Date Range Selector
            <FaCalendarAlt />
          </button>
          {showDateRange && (
            <div
              ref={dateRangeRef}
              className="absolute top-15 right-5 shadow-md w-[600px] z-50 rounded-md dark:bg-db-primary bg-db-secondary-light p-7 border dark:border-transparent border-white "
            >
              <div className="flex justify-between">
                <h3 className="text-2xl font-medium">Select Date Range :</h3>
                <span
                  onClick={() => setShowDateRange(false)}
                  className="text-2xl font-extrabold cursor-pointer"
                >
                  X
                </span>
              </div>
              <div className="flex items-center mt-10 gap-14">
                <p className="text-lg font-normal">Select Date Range* :</p>
                <div className="flex items-center gap-2">
                  <div
                    className="text-base cursor-pointer"
                    onClick={() => setDateRangeType("long")}
                  >
                    Long
                  </div>
                  <div
                    onClick={() =>
                      setDateRangeType(() =>
                        dateRangeType === "short" ? "long" : "short"
                      )
                    }
                    className="w-14 h-6 dark:bg-[#00114e] bg-primary-light rounded-[5px] flex items-center p-1 cursor-pointer transition-all"
                  >
                    <div
                      className={`w-6 h-6 bg-primary rounded-[5px] shadow-md transform transition-all ${
                        dateRangeType === "short" ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                  <div
                    className="text-base cursor-pointer"
                    onClick={() => setDateRangeType("short")}
                  >
                    Short
                  </div>
                </div>
              </div>
              <div className="flex items-center my-10 justify-between w-full">
                <p className="text-lg font-normal">Entry Date & Time* :</p>
                <input
                  ref={startInputRef}
                  type="date"
                  value={formatDateForInput(tempDates.startDate)}
                  onChange={(e) => handleDateChange(e, "start")}
                  onClick={() => handleInputClick(startInputRef)}
                  className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%]"
                />
              </div>
              <div className="flex items-center w-full justify-between">
                <p className="text-lg font-normal">Entry Date & Time* :</p>
                <input
                  ref={endInputRef}
                  type="date"
                  value={formatDateForInput(tempDates.endDate)}
                  onChange={(e) => handleDateChange(e, "end")}
                  onClick={() => handleInputClick(endInputRef)}
                  className="dark:bg-[#00114E] bg-primary-light rounded-sm px-3 py-1 w-[60%]"
                />
              </div>

              <button
                className="bg-primary w-full text-white rounded-md py-2 mt-10"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )} </div>
          
        </div>
      </div>

      <section className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md">
        <div className="dark:bg-db-primary bg-db-primary-light rounded-md p-2.5">
          <CalendarGrid
            setSelectedDate={setSelectedDate}
            selectedDateRange={[dateRange]}
          />

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-2.5 my-2.5">
            <section className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md">
              <div className="dark:bg-db-secondary bg-db-secondary-light shadow-lg rounded-sm p-3 h-full">
                <Calendar
                  onChange={setDate}
                  value={new Date(selectedYear, selectedMonthIndex, 1)}
                  locale="en-US"
                  className="custom-calendar-TJ w-full"
                  maxDetail="month"
                  showNavigation={false}
                  showNeighboringMonth={false}
                  prevLabel={null}
                  nextLabel={null}
                  next2Label={null}
                  prev2Label={null}
                />
              </div>
            </section>

            <section className="lg:col-span-2 bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md">
              <div className="dark:bg-db-secondary bg-db-secondary-light rounded-md p-2.5">
                <h5 className="font-normal text-2xl text-center mb-6">
                  Statistics
                </h5>
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 w-[90%] mx-auto mb-5">
                  {[
                    "Total P&L",
                    "Total Trades",
                    "Biggest Win",
                    "Biggest Loss",
                    "Avg. Winner",
                    "Avg. Loser",
                    "Risk to Reward",
                    "Avg. P&L",
                  ].map((stat, index) => (
                    <div
                      key={stat}
                      className={`dark:bg-db-primary bg-primary-light flex flex-col items-center rounded-md px-4 py-5 ${
                        index >= 4 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <p className="flex items-center gap-3">
                        <p className="text-sm">{stat}</p>
                        <FaInfoCircle />
                      </p>
                      <p>--</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-2.5">
            {["Top Winner", "Top Loser"].map((title) => (
              <section
                key={title}
                className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md"
              >
                <div className="dark:bg-db-secondary bg-db-secondary-light rounded-md p-2.5">
                  <h5 className="font-normal text-2xl text-center mb-6">
                    {title}
                  </h5>
                  <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-[90%] mx-auto mb-5">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="dark:bg-db-primary bg-primary-light flex flex-col items-center rounded-md px-4 py-5"
                      >
                        <p className="text-sm">
                          {title.split(" ")[1]} {num}
                        </p>
                        <p>--</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TradingJournal;
