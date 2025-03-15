import axios from "axios";
import { useState } from "react";

const serverUri = "http://localhost:3000/api";



export const fetchStockData = () => {

    const [TnGData, setData] = useState([]);
    const [TnGLoading, setLoading] = useState(null);
    const [TnGError, setError] = useState("");


   const  topGainersAndLosers = async () => {
      
        try {
          setLoading(true);
      
          const response = await axios.get(`${serverUri}/get-top-gainers-and-losers`);
          setData(response);
        } catch (error) {
          console.log("eeror to get top gaineres and loosers", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      
    };

   


    return { TnGData, TnGLoading, TnGError,topGainersAndLosers };
      
}
export const usefetchDayHighData = () => {

    const [DhData, setData] = useState([]);
    const [DhLoading, setLoading] = useState(null);
    const [DhError, setError] = useState("");


   const  fetchDayHigh = async () => {
      
        try {
          setLoading(true);
      
          const response = await axios.get(`${serverUri}/get-day-high-break`);
      
          setData(response);
        } catch (error) {
          console.log("eeror to get top gaineres and loosers", error);
          setError(error);
        } finally {
          setLoading(false);
        }
      
    };

   


    return { DhData, DhLoading,  DhError, fetchDayHigh };
      
}
export const usefetchDayLowData = () => {

    const [DlData, setDlData] = useState([]);
    const [DlLoading, setDlLoading] = useState(null);
    const [DlError, setDlError] = useState("");


   const  fetchDayLow = async () => {
      
        try {
          setDlLoading(true);
      
          const response = await axios.get(`${serverUri}/get-day-low-break`);
      
          setDlData(response);
        } catch (error) {
          console.log("eeror to get top gaineres and loosers", error);
          setDlError(error);
        } finally {
          setDlLoading(false);
        }
      
    };

   


    return { DlData, DlLoading,  DlError, fetchDayLow };
      
}



 