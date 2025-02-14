import React, { useState, useEffect } from "react";
import axios from "axios";
import lock from "../assets/Images/lock.svg";
import play from "../assets/Images/play.svg";
import doc from "../assets/Images/doc.svg";
import shild from "../assets/Images/shild.svg";
import pay from "../assets/Images/payImg.png";

const BuyPlanPage = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Fetch countries data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries"
        );
        setCountries(response.data.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/states",
            { country: selectedCountry }
          );
          setStates(response.data.data.states);
        } catch (error) {
          console.error("Error fetching state data:", error);
        }
      }
    };
    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCountryCode = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/codes",
            { country: selectedCountry }
          );
          setCountryCode(response.data.data?.dial_code || "");
        } catch (error) {
          console.error("Error fetching country code:", error);
        }
      }
    };
    fetchCountryCode();
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedState("");
    setCountryCode(""); 
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  return (
    <>
      <div className="bg-[url(./assets/Images/heroImg.png)] w-[90%] h-[360px] mx-auto object-center bg-no-repeat my-35 flex items-center justify-center ">
        <div className="blue-blur-circle"></div>
        <h1 className="text-6xl font-abcRepro font-bold ">Buy Plan</h1>
      </div>

      <div className="w-[70%] mx-auto bg-[#01071C] px-8 pt-8 font-abcRepro space-y-10 rounded-xl border border-[#0256f550] flex items-start gap-5 ">
        <div className="w-[60%]">
          <div className="flex flex-col space-y-10">
            <h3 className="text-2xl font-medium">Don’t Just Trade Dominate</h3>
            <p className="bg-primary rounded-lg text-2xl font-thin px-3 py-2 w-1/2">
              CRYSTAL (Rs. 3999)
            </p>
            <p className="text-2xl font-bold">
              Duration: 6 months + 6 Months Free
            </p>
          </div>

          <div className=" mt-15">
            <form action="">
              <div className="flex items-center justify-between flex-wrap  text-white space-y-6">
                <input
                  type="text"
                  placeholder="First Name*"
                  className="w-[45%]  bg-[#000A2D] py-2 rounded-lg px-3"
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  className="w-[45%]   bg-[#000A2D] py-2 rounded-lg px-3"
                />

                {/* Country Dropdown */}
                <select
                  name="country"
                  className="w-[45%] px-4 bg-[#000A2D] py-2 rounded-lg"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>

                {/* State Dropdown */}
                <select
                  name="state"
                  className="w-[45%] px-4 bg-[#000A2D] py-2 rounded-lg"
                  value={selectedState}
                  onChange={handleStateChange}
                  disabled={!selectedCountry} // Disable if no country is selected
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {states.length > 0 ? (
                    states.map((state, index) => (
                      <option key={index} value={state.name}>
                        {state.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No states available</option>
                  )}
                </select>

                <div className="w-full flex items-center gap-2">
                  <p className="px-2 w-[15%] text-center py-2 bg-[#000A2D] rounded-lg">{countryCode||"+91"}</p>
                  <input
                    type="number"
                    placeholder="Whatsapp Number*"
                    className="w-[85%] bg-[#000A2D] py-2 rounded-lg px-3"
                  />
                </div>

                <input
                  type="email"
                  placeholder="G-Mail Id*"
                  className="w-full bg-[#000A2D] py-2 rounded-lg px-3"
                />
                <input
                  type="email"
                  placeholder="Re-enter G-Mail Id"
                  className="w-full bg-[#000A2D] py-2 rounded-lg px-3"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Payment Information */}
        <div className="w-[40%] bg-[#72A3FD] rounded-2xl  p-5">
          <h5 className="text-primary font-bold text-xl">Payment Information</h5>

          <div className="w-full flex justify-between items-center text-black text-sm font-thin mt-10 ">
            <p>Amount</p>
            <p>&#8377;3388.98</p>
          </div>
          <div className="w-full flex justify-between items-center text-black text-sm font-thin mt-5">
            <p>GST @18%</p>
            <p>&#8377;610.02</p>
          </div>
          <div className="w-full flex justify-between items-center text-black text-sm font-thin mt-5">
            <p>Amount Payable</p>
            <p>&#8377;3,999</p>
          </div>
          <div className="flex flex-col space-y-5 text-black my-10">
            <div className="flex items-center gap-3">
              <img src={lock} alt="" className="w-6 h-6" />
              <p className="text-base font-normal">Get Instant Access Now</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={doc} alt="" className="w-6 h-6" />
              <p className="text-base font-normal">Watch Tutorials Inside</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={play} alt="" className="w-6 h-6" />
              <p className="text-base font-normal">View All Strategies</p>
            </div>
            <div className="flex items-center gap-3">
              <img src={shild} alt="" className="w-6 h-6" />
              <p className="text-base font-normal">Prepare For Tomorrow</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-black">
            <input type="checkbox" className="w-4 h-4" name="TandC" />
            <label htmlFor="TandC" className="text-xl">I agree with terms & Condition</label>
          </div>
          <img src={pay} alt="" className="w-4/5 cursor-pointer mt-5 mx-auto" />
        </div>
      </div>
    </>
  );
};

export default BuyPlanPage;
