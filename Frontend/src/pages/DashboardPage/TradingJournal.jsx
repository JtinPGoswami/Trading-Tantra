import React, { useState } from "react";
import CalendarGrid from "../../Components/Dashboard/CalenarGrid"; // Fixed typo in "CalendarGrid"
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TradingJournal = () => {
  const [date, setDate] = useState(new Date());
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: today,
      endDate: today,
      key: "selection",
    },
  ]);

  const selectedMonthIndex = selectedDate.month
    ? new Date(`${selectedDate.month} 1, 2024`).getMonth()
    : today.getMonth();
  const selectedYear = selectedDate.year || today.getFullYear();

  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

  const handleDateRangeChange = (item) => {
    let { startDate, endDate } = item.selection;
    const diff = endDate - startDate;

    if (diff < ONE_MONTH) {
      endDate = new Date(startDate.getTime() + ONE_MONTH);
    } else if (diff > ONE_YEAR) {
      endDate = new Date(startDate.getTime() + ONE_YEAR);
    }

    setDateRange([{ startDate, endDate, key: "selection" }]);
  };

  const handleApply = () => {
    setShowDateRange(false);
    console.log(dateRange[0]);
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-semibold text-3xl my-5">Trading Journal</h1>

      <div className="flex justify-between items-center mb-5">
        <button className="text-sm px-3 py-2 border border-primary text-primary rounded-[5px]">
          How To Use Trading Journal?
        </button>
        <div className="flex gap-2.5">
          <button className="text-sm font-normal bg-[#72A3FE] rounded-[5px] py-2 px-3">
            Add Trade (+)
          </button>
          <button
            className="text-sm font-normal flex items-center gap-2 bg-[#0256F5] rounded-[5px] py-2 px-3"
            onClick={() => setShowDateRange(!showDateRange)}
          >
            Date Range Selector
            <FaCalendarAlt />
          </button>
          {showDateRange && (
            <div className="absolute top-12 right-0 shadow-md p-3 z-50 rounded-md bg-db-primary">
              <DateRange
                editableDateInputs={true}
                onChange={handleDateRangeChange}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#000000"]}
              />
              <button
                className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-md w-full"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md">
        <div className="dark:bg-db-primary bg-db-primary-light rounded-md p-2.5">
          <CalendarGrid
            setSelectedDate={setSelectedDate}
            selectedDateRange={dateRange}
          />

          <div className="grid grid-cols-3 gap-2.5 my-2.5">
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

            <section className="col-span-2 bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md">
              <div className="dark:bg-db-secondary bg-db-secondary-light rounded-md p-2.5">
                <h5 className="font-normal text-2xl text-center mb-6">
                  Statistics
                </h5>
                <div className="grid grid-cols-4 gap-5 w-[90%] mx-auto mb-5">
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
                      className={`dark:bg-db-primary bg-db-primary-light flex flex-col items-center rounded-md px-4 py-5 ${
                        index >= 4 ? "col-span-2" : ""
                      }`}
                    >
                      <p className="flex items-center  gap-3">
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

          <div className="grid grid-cols-2 gap-2.5">
            {["Top Winner", "Top Loser"].map((title) => (
              <section
                key={title}
                className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px rounded-md"
              >
                <div className="dark:bg-db-secondary bg-db-secondary-light rounded-md p-2.5">
                  <h5 className="font-normal text-2xl text-center mb-6">
                    {title}
                  </h5>
                  <div className="grid grid-cols-3 gap-5 w-[90%] mx-auto mb-5">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className="dark:bg-db-primary  bg-db-primary-light flex flex-col items-center rounded-md px-4 py-5"
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
