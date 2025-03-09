import React, { useState } from "react";
import CAGRImg from "../../assets/Images/Dashboard/calculators/CRGRImg.png";
import EMIImg from "../../assets/Images/Dashboard/calculators/EMIImg.png";
import OptionImg from "../../assets/Images/Dashboard/calculators/OptionImg.png";
import SIPImg from "../../assets/Images/Dashboard/calculators/SIPImg.png";
import {
  RiskCalculator,
  RiskCalculatorRight,
} from "../../Components/Dashboard/RiskCalculator";
import CAGRCalculator from "../../Components/Dashboard/CAGRCalculator";
import SIPCalculator from "../../Components/Dashboard/SIPCalculator";
import EMICalculator from "../../Components/Dashboard/EMICalculator";
import OptionCalculator from "../../Components/Dashboard/OptionCalculator";
const CalculatorsPage = () => {
  const [calculator, setCalculator] = useState("Equity");
  const [selectedCalculator, setSelectedCalculator] = useState("Risk");
  const [riskLevel, setRiskLevel] = useState(
    localStorage.getItem("riskLevel") || "Low"
  );
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
    <>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 mt-10  ">
        {/* Left Section */}
        <div className="lg:col-span-2 dark:bg-db-primary bg-db-secondary-light border border-[#0256f550] p-5 rounded-md">
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
          <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide mt-8">
            <div className="flex space-x-4 w-max">
              {calculators.map((calc) => (
                <button
                  key={calc}
                  className={`p-2.5 rounded-sm dark:hover:bg-primary hover:bg-primary-light   transition-all ${
                    selectedCalculator === calc ? "dark:bg-primary bg-primary-light" : ""
                  }`}
                  onClick={() => handelCalculatorChange(calc)}
                >
                  {calc} Calculator
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Form */}
          {selectedCalculator === "Risk" ? (
            <RiskCalculator calculator={calculator} />
          ) : selectedCalculator === "CAGR" ? (
            <CAGRCalculator calculator={calculator} />
          ) : selectedCalculator === "SIP" ? (
            <SIPCalculator calculator={calculator} />
          ) : selectedCalculator === "EMI" ? (
            <EMICalculator />
          ) : (
            selectedCalculator === "Option" && <OptionCalculator />
          )}
        </div>

        {/* Right Section  */}
        <div className=" flex flex-col items-center px-5 py-12 font-abcRepro  dark:bg-db-primary bg-db-secondary-light border border-[#0256f550]  space-y-[45px]">
          {selectedCalculator === "Risk" ? (
            <RiskCalculatorRight />
          ) : selectedCalculator === "CAGR" ? (
            <>
              <h1 className="text-2xl font-medium text-wrap">
                CAGR / Reverse CAGR Calculator
              </h1>
              <img src={CAGRImg} />
              <p className="text-2xl font-normal text-wrap">
                Compound annual growth rate (CAGR) is the mean annual growth
                rate over a specified time.
              </p>
              <p className="text-wrap text-lg font-light">
                CAGR tells you the average rate of return you have earned on
                your investments every year. CAGR is very useful for investors
                because it is an accurate measure of investment growth (or fall)
                over time.
              </p>
            </>
          ) : selectedCalculator === "SIP" ? (
            <>
              <h1 className="text-2xl font-medium text-wrap">SIP Calculator</h1>
              <img src={SIPImg} />
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
          ) : selectedCalculator === "EMI" ? (
            <>
              <h1 className="text-2xl font-medium text-wrap">EMI Calculator</h1>
              <img src={EMIImg} />
              <p className="text-2xl font-normal text-wrap">
                Calculate your monthly Installment for your Loan with This EMI
                calculator.
              </p>
              <p className="text-wrap text-lg font-light">
                To use this Calculator, Enter the Loan Amount, The Loan tenure
                and the rate of interest. After filling the below fields you
                will get the amount you will have to pay per month.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-medium text-wrap">
                Option Calculator
              </h1>
              <p className="text-2xl font-normal text-wrap">
                Compound annual growth rate (CAGR) is the mean annual growth
                rate over a specified time.
              </p>
              <img src={OptionImg} />
              <p className="text-wrap text-lg font-light">
                CAGR tells you the average rate of return you have earned on
                your investments every year. CAGR is very useful for investors
                because it is an accurate measure of investment growth (or fall)
                over time.
              </p>
            </>
          )}
        </div>
      </div>
      <section className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px my-[30px] rounded-md mr-2">
        <div className="font-abcRepro dark:bg-db-primary  bg-db-primary-light p-[30px] rounded-md  ">
          <h2 className="text-2xl font-semibold mb-5">What is Risk calculator?</h2>
          <div className="space-y-6">
            <p className="text-base font-light">
              One of the most important tools in a trader's bag is risk
              management. Proper position sizing is key to managing risk and to
              avoid blowing out your account on a single trade. If your position
              size is too limited or too wide, you may end up taking a lot of
              risks or end up taking not enough for you to profit from a trade.
            </p>
            <p className="text-base font-light">
              Knowing your risk position is critical to establishing a winning
              strategy. Our calculator helps you make trading decisions based on
              intellect and not emotion. That's how you trade like a pro.
            </p>
            <p className="text-base font-light">
              With a few simple inputs, our calculator will help you find the
              approximate units to buy or sell to control your maximum risk per
              position.
            </p>
          </div>
          <h2 className="text-2xl font-semibold my-[30px]">
            Important terms to understand
          </h2>
          <div className="space-y-6">
            <p className="text-base font-light">
              Account capital : Pretty straightforward, traders just need to
              input their account capital.
            </p>
            <p className="text-base font-light">
              Risk per trade (%) : This is a crucial field. Here you have to put
              the risk you are wiling to take on that trade in terms of % of
              your account capital.
              <br />
              All Pro traders take risk in a range of 1-5% per trade.
            </p>
            <p className="text-base font-light">
              Stoploss in rupee : Here, traders should input the maximum number
              of points they are willing to risk, or lose, in a trade, to
              protect the account capital in case the market goes against their
              position.
            </p>
            <p className="text-base font-light">
              For eg: You bought in BankNifty CE at 250 Rs and as per your
              analysis you should exit that trade if price goes below 200 Rs. So
              here you are stoploss is (250 - 200) = Rs. 50
            </p>
            <p className="text-base font-light">
              Lot size : If you are trading in F&O enter the lot size of
              instrument you are taking trade in.
            </p>
          </div>
        </div>{" "}
      </section>
      <section className="bg-gradient-to-tr from-[#0009B2] to-[#02000E] p-px my-[30px] rounded-md mr-2">
        <div className="font-abcRepro dark:bg-db-primary bg-db-primary-light  p-[30px] rounded-md  ">
          <h2 className="text-2xl font-semibold mb-[25px]">
            How to use this Calculator?
          </h2>
          <h2 className="text-base font-semibold mb-5">For Equity:</h2>
          <ul>
            <li className="text-base font-light ">
              Let's say you have purchased Reliance at 2500.
            </li>
            <li className="text-base font-light ">
              Your Account Capital is 1,00,000
            </li>
            <li className="text-base font-light ">
              You are willing to take Risk per trade is 2%
            </li>
            <li className="text-base font-light mb-6">
              You are planning to exit Reliance if it goes down below 2430,
              so stoploss in rupees is 70
            </li>
            <li className="text-base font-light ">
              Total quantity you can enter with =
            </li>
            <li className="text-base font-light mb-6 ">
              Account capital × Risk per trade (%) / 100 / Stoploss in rupees =
              (1,00,000) × (2) / 100 / 70 = 28.57 ≈ 28
            </li>
            <li className="text-base font-light ">
              Now amount at risk = Total quantity × stoploss = 28 × 70 = 1960
            </li>
          </ul>
          <h2 className="text-lg font-sebasebold my-[30px]">For F&O:</h2>
          <ul>
            <li className="text-base font-light ">
              Let's say you have a capital of 1,00,000
            </li>
            <li className="text-base font-light mb-6 ">
              Account Capital = 1,00,000
            </li>
            <li className="text-base font-light ">
              Now you are willing to take 2% risk per trade. That is the maximum
              you are willing to lose if trade goes wrong is 2% of account
              capital
            </li>
            <li className="text-base font-light mb-6">= 2% of 1,00,000 = 2000</li>
            <li className="text-base font-light ">So, Risk Per Trade (%) = 2%</li>
            <li className="text-base font-light ">
              You are trading in BankNifty CE
            </li>
            <li className="text-base font-light ">Lot size of BankNIfty is 25</li>
            <li className="text-base font-light mb-6">Lot size = 25</li>
            <li className="text-base font-light ">
              Now you have bought the BankNIfty CE at 250 rupees and as per your
              analysis if BankNifty CE goes below 215 level, you should exit the
              trade. So here your risk is (250-215) = Rs. 35
            </li>
            <li className="text-base font-light mb-6 ">
              So, Stoploss in rupee = 35
            </li>
            <li className="text-base font-light ">
              Here as you are trading in Derivative, you have to buy/sell
              minimum 1 lot.
            </li>
            <li className="text-base font-light ">
              So. first we will find risk per lot
            </li>
            <li className="text-base font-light mb-6">
              Risk per Lot = Lot Size × Stoploss in Rupee = 25 × 35 = 875
            </li>
            <li className="text-base font-light ">
              Now, No of lots you can trade = Risk per trade in rupee / Risk per
              Lot
            </li>
            <li className="text-base font-light mb-6 ">
              = 2% of capital / (25 × 35) = 2000 / 875 = 2.28 ≈ 2 lots
            </li>
            <li className="text-base font-light mb-6">
              Total Quantity = No. of lots × Lot Size = 2 × 25 = 50
            </li>
            <li className="text-base font-light ">
              Amount at risk = No. of Lots × Risk per Lot = 2 × 875 = 1750
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default CalculatorsPage;
