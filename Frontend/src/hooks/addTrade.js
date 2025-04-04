import axios from "axios";

const addTrade = async (tradeData) => {
  try {
    const response = await axios.post(
      "http://13.60.46.100:3000/api/auth/add-trade",
      tradeData,
      { withCredentials: true }
    );

    console.log("Trade added successfully:", response.data);
  } catch (error) {
    console.error("Error adding trade:", error.response?.data || error.message);
  }
};

export default addTrade;
