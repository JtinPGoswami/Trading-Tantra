import React from "react";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";

const monthsToShow = [3, 4, 5, 6, 7, 8,9,10,11,12,1,2]; 
const year = 2024;

const getStartDayIndex = (year, month) => new Date(year, month - 1, 1).getDay();
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

const getColor = (value) => {
  if (value > 150) return "bg-green-900";
  if (value > 50) return "bg-green-600";
  if (value > 0) return "bg-green-300";
  if (value === 0) return "bg-gray-200";
  if (value < -150) return "bg-red-900";
  if (value < -50) return "bg-red-600";
  return "bg-red-300";
};

const generateMonthData = (year, month) => {
  const startDay = getStartDayIndex(year, month);
  const totalDays = getDaysInMonth(year, month);
  const data = Array.from({ length: totalDays }, (_, i) => ({
    date: `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
    value: Math.floor(Math.random() * 401) - 200,
  }));

  const calendar = [];
  let week = new Array(7).fill(null);

  for (let i = 0; i < startDay; i++) {
    week[i] = null;
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayIndex = (startDay + day - 1) % 7;
    week[dayIndex] = data[day - 1];

    if (dayIndex === 6 || day === totalDays) {
      calendar.push(week);
      week = new Array(7).fill(null);
    }
  }

  return { calendar, monthName: new Date(year, month - 1, 1).toLocaleString("default", { month: "long" }) };
};

const CalendarGrid = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-10">
      {monthsToShow.map((month) => {
        const { calendar, monthName } = generateMonthData(year, month);
        return (
          <div key={month} className="bg-[#0b0d28] text-white p-4 rounded-md shadow-lg w-64">
            <h2 className="text-center font-bold mb-3">{monthName}</h2>
            <div className="grid grid-cols-7 gap-2 text-sm font-bold mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendar.flat().map((entry, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-8 h-8 rounded-md flex items-center justify-center text-xs",
                    entry ? getColor(entry.value) : "bg-gray-800 opacity-50"
                  )}
                  data-tooltip-id={entry?.date}
                >
                  {entry && (
                    <>
                      <Tooltip id={entry.date} place="top">
                        {entry.date} - {entry.value > 0 ? `Profit: ₹${entry.value}` : entry.value < 0 ? `Loss: ₹${Math.abs(entry.value)}` : "Neutral"}
                      </Tooltip>
                      {parseInt(entry.date.split("-")[2])}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;
