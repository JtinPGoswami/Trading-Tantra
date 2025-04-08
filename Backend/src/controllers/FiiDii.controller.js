import FiiDiiData from "../models/FiiDiiData.model.js";

const getFiiDiiData = async (req, res) => {
  try {
    const data = await FiiDiiData.find({}, { _id: 0, __v: 0 }).lean();
    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    const resdata = data.map((item) => ({
      date: item.date,
      fii_net: parseFloat(item.fii_net.replace(/,/g, "")),
      dii_net: parseFloat(item.dii_net.replace(/,/g, "")),
      fii_buy: parseFloat(item.fii_buy.replace(/,/g, "")),
      fii_sell: parseFloat(item.fii_sell.replace(/,/g, "")),
      dii_buy: parseFloat(item.dii_buy.replace(/,/g, "")),
      dii_sell: parseFloat(item.dii_sell.replace(/,/g, "")),
    }));

    // Sort by date descending
    resdata.sort((a, b) => {
      const parseDate = (d) => new Date(d.replace(/-/g, " "));
      return parseDate(b.date) - parseDate(a.date); // Latest date first
    });

    res.status(200).json({ success: true, resdata });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default getFiiDiiData;
