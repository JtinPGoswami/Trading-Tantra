import React, { useState } from "react";
import CAGRImg from "../../assets/Images/Dashboard/calculators/CRGRImg.png";
import EMIImg from "../../assets/Images/Dashboard/calculators/EMIImg.png";
import OptionImg from "../../assets/Images/Dashboard/calculators/OptionImg.png";
import SIPImg from "../../assets/Images/Dashboard/calculators/SIPImg.png";
import RiskCalculator from "../../Components/Dashboard/RiskCalculator";
import CAGRCalculator from "../../Components/Dashboard/CAGRCalculator";
import SIPCalculator from "../../Components/Dashboard/SIPCalculator";
import EMICalculator from "../../Components/Dashboard/EMICalculator";
import OptionCalculator from "../../Components/Dashboard/OptionCalculator";
const CalculatorsPage = () => {
  const [calculator, setCalculator] = useState("Equity");
  const [selectedCalculator, setSelectedCalculator] = useState("Risk");

  const handleToggle = () => {
    if (selectedCalculator === "Risk") {
      setCalculator((prev) => (prev === "Equity" ? "F&O" : "Equity"));
    } else if (selectedCalculator === "CAGR") {
      setCalculator((prev) => (prev === "CAGR" ? "Reverse CAGR" : "CAGR"));
    } else if (selectedCalculator === "SIP") {
      setCalculator((prev) => (prev === "SIP" ? "LUMPSUM" : "SIP"));
    }
  };

  const handelCalculatorChange = (calc) => {
    setSelectedCalculator(calc);
    if (calc === "Risk") {
      setCalculator("Equity");
    } else if (calc === "CAGR") {
      setCalculator("CAGR");
    } else if (calc === "SIP") {
      setCalculator("SIP");
    } else {
      setCalculator("");
    }
  };

  const calculators = ["Risk", "CAGR", "SIP", "EMI", "Option"];

  return (
    <div className="grid grid-cols-3 gap-10 mt-10 mx-10 ">
      {/* Left Section */}
      <div className="col-span-2 bg-db-primary border border-[#0256f550] p-5 rounded-md">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          {selectedCalculator === "Risk" ? (
            <h5 className="font-abcRepro text-3xl font-medium">
              Risk Calculator
            </h5>
          ) : selectedCalculator === "CAGR" ? (
            <h5 className="font-abcRepro text-3xl font-medium">
              CAGR Calculator
            </h5>
          ) : selectedCalculator === "SIP" ? (
            <h5 className="font-abcRepro text-3xl font-medium">
              SIP Calculator
            </h5>
          ) : selectedCalculator === "EMI" ? (
            <h5 className="font-abcRepro text-3xl font-medium">
              EMI Calculator
            </h5>
          ) : (
            <h5 className="font-abcRepro text-3xl font-medium">
              Option Calculator
            </h5>
          )}
          {(selectedCalculator === "Risk" ||
            selectedCalculator === "CAGR" ||
            selectedCalculator === "SIP") && (
            <div className="flex items-center gap-2.5">
              {/* Calculator Toggle */}
              {selectedCalculator === "Risk" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("Equity")}
                >
                  Equity
                </p>
              )}
              {selectedCalculator === "CAGR" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("CAGR")}
                >
                  CAGR
                </p>
              )}
              {selectedCalculator === "SIP" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("SIP")}
                >
                  SIP
                </p>
              )}

              {/* Toggle Slider */}
              <div
                onClick={handleToggle}
                className="w-14 h-7 bg-white rounded-full flex items-center p-1 cursor-pointer transition-all"
              >
                <div
                  className={`w-6 h-6 bg-primary rounded-full shadow-md transform transition-all ${
                    (selectedCalculator === "Risk" && calculator === "F&O") ||
                    (selectedCalculator === "CAGR" &&
                      calculator === "Reverse CAGR") ||
                    (selectedCalculator === "SIP" && calculator === "LUMPSUM")
                      ? "translate-x-6"
                      : ""
                  }`}
                />
              </div>

              {/* Option Toggle */}
              {selectedCalculator === "Risk" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("F&O")}
                >
                  F&O
                </p>
              )}
              {selectedCalculator === "CAGR" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("Reverse CAGR")}
                >
                  Reverse CAGR
                </p>
              )}
              {selectedCalculator === "SIP" && (
                <p
                  className="cursor-pointer"
                  onClick={() => setCalculator("LUMPSUM")}
                >
                  LUMPSUM
                </p>
              )}
            </div>
          )}
        </div>

        {/* Calculator Selection Buttons */}
        <div className="flex justify-between items-center mt-8">
          {calculators.map((calc) => (
            <button
              key={calc}
              className={`p-2.5  rounded-sm hover:bg-primary transition-all ${
                selectedCalculator === calc && "bg-primary"
              }`}
              onClick={() => handelCalculatorChange(calc)}
            >
              {calc} Calculator
            </button>
          ))}
        </div>

        {/* Calculator Form */}
      {selectedCalculator==="Risk"?<RiskCalculator calculator={calculator}/>:selectedCalculator==="CAGR"?<CAGRCalculator calculator={calculator}/>: selectedCalculator==="SIP"?<SIPCalculator calculator={calculator}/>:selectedCalculator==="EMI"?<EMICalculator/>:selectedCalculator==="Option"&&<OptionCalculator/>}
      </div>

      {/* Right Section  */}
      <div className="flex flex-col items-center px-5 py-12 font-abcRepro  bg-db-primary border border-[#0256f550]  space-y-[45px]">
        {selectedCalculator === "Risk" ? (
          <>
            <h1 className="text-2xl font-medium text-wrap">
              Risk/Position Size Calculator
            </h1>
            <div className="w-[150px] h-[150px] "></div>
            <p className="text-2xl font-normal text-wrap">
              Calculating risk before enter a trade is important to ensure
              traders capital safety.
            </p>
            <p className="text-wrap text-lg font-light">
              To use this risk calculator, enter your account capital, and the
              percentage of your account you wish to risk. Our calculator will
              suggest position sizes based on the information you provide.
            </p>
          </>
        ) : selectedCalculator === "CAGR" ? (
          <>
            <h1 className="text-2xl font-medium text-wrap">
              CAGR / Reverse CAGR Calculator
            </h1>
            <img src={CAGRImg} />
            <p className="text-2xl font-normal text-wrap">
              Compound annual growth rate (CAGR) is the mean annual growth rate
              over a specified time.
            </p>
            <p className="text-wrap text-lg font-light">
              CAGR tells you the average rate of return you have earned on your
              investments every year. CAGR is very useful for investors because
              it is an accurate measure of investment growth (or fall) over
              time.
            </p>
          </>
        ) : selectedCalculator === "SIP" ? (
          <>
            <h1 className="text-2xl font-medium text-wrap">
            SIP Calculator
            </h1>
            <img src={SIPImg} />
            <p className="text-2xl font-normal text-wrap">
            Calculating risk before enter a trade is important to ensure traders capital safety.
            </p>
            <p className="text-wrap text-lg font-light">
            To use this risk calculator, enter your account capital, and the percentage of your account you wish to risk. Our calculator will suggest position sizes based on the information you provide.
            </p>
          </>
        ) : selectedCalculator === "EMI" ? (
          <>
            <h1 className="text-2xl font-medium text-wrap">
            EMI Calculator
            </h1>
            <img src={EMIImg} />
            <p className="text-2xl font-normal text-wrap">
            Calculate your monthly Installment for your Loan with This EMI calculator.
            </p>
            <p className="text-wrap text-lg font-light">
            To use this Calculator, Enter the Loan Amount, The Loan tenure and the rate of interest. After filling the below fields you will get the amount you will have to pay per month.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium text-wrap">
            Option Calculator
            </h1>
            <p className="text-2xl font-normal text-wrap">
              Compound annual growth rate (CAGR) is the mean annual growth rate
              over a specified time.
            </p>
            <img src={OptionImg} />
            <p className="text-wrap text-lg font-light">
              CAGR tells you the average rate of return you have earned on your
              investments every year. CAGR is very useful for investors because
              it is an accurate measure of investment growth (or fall) over
              time.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CalculatorsPage;
