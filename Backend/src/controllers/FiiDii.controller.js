import FiiDiiData from "../models/FiiDiiData.model.js";

const getFiiDiiData = async (req, res) => {
  try {
    const data = await FiiDiiData.find({}, { _id: 0, __v: 0 }).lean();
    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    const resdata = [];

    data.map((data) => {
      resdata.push({
        date: data.date,
        fii_net: parseFloat(data.fii_net.replace(/,/g, "")),
        dii_net: parseFloat(data.dii_net.replace(/,/g, "")),
        fii_buy: parseFloat(data.fii_buy.replace(/,/g, "")),
        fii_sell: parseFloat(data.fii_sell.replace(/,/g, "")),
        dii_buy: parseFloat(data.dii_buy.replace(/,/g, "")),
        dii_sell: parseFloat(data.dii_sell.replace(/,/g, "")),
      });
    });
    res.status(200).json({ success: true, resdata });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default getFiiDiiData;
