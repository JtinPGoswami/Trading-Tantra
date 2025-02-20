import React from "react";

const RiskCalculator = ({calculator}) => {
  
  return (
    <div>
      {" "}
      <div className="py-11 px-5 bg-[#00114E] rounded-md mt-10">
        <form className="space-y-6">
          {calculator === "Equity" ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {[
                {
                  label: "Account Capital*",
                  name: "ACcapital",
                  placeholder: "Enter Capital Amount",
                },
                {
                  label: "Risk Per Trade (%)*",
                  name: "RPTrade",
                  placeholder: "Enter Risk per Trade",
                },
                {
                  label: "Stoploss (in Rupees)*",
                  name: "stoploss",
                  placeholder: "Enter Stoploss",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="flex flex-col items-start space-y-3">
                  <label
                    className="text-lg font-abcRepro font-light"
                    htmlFor={name}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    name={name}
                    required
                    className="pb-3 w-full bg-transparent outline-none border-b border-white"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {[
                {
                  label: "Account Capital*",
                  name: "ACcapital",
                  placeholder: "Enter Capital Amount",
                },
                {
                  label: "Risk Per Trade (%)*",
                  name: "RPTrade",
                  placeholder: "Enter Risk per Trade",
                },
                {
                  label: "Stoploss (in Rupees)*",
                  name: "stoploss",
                  placeholder: "Enter Stoploss",
                },
                {
                  label: "Lot Size*",
                  name: "lotSize",
                  placeholder: "Enter Lot Size",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="flex flex-col items-start space-y-3">
                  <label
                    className="text-lg font-abcRepro font-light"
                    htmlFor={name}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    name={name}
                    required
                    className="pb-3 w-full bg-transparent outline-none border-b border-white"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between items-center gap-10 mt-[50px]">
            <button className="bg-[#72A2FE] py-2 rounded-md w-4/5">
              Clear
            </button>
            <button className="bg-primary py-2 rounded-md w-4/5">
              Calculate
            </button>
          </div>
        </form>
      </div>
      <div className="py-5 px-7 bg-[#00114E] rounded-md mt-5 ">
        <h4 className="text-3xl font-abcRepro font-light">Result:</h4>
        <div className="mt-[30px] space-y-5">
          <div className="flex w-full justify-between items-center font-abcRepro text-2xl font-light">
            <p>Amount at Risk:</p>
            <p>0</p>
          </div>
          <div className="flex w-full justify-between items-center font-abcRepro text-2xl font-light">
            <p>Total Quantity:</p>
            <p>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
