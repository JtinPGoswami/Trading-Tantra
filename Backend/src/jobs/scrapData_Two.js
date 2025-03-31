import axios from "axios";
import * as cheerio from "cheerio";
import FiiDiiData from "../models/FiiDiiData.model.js";

async function scrapeAndSaveFIIDIIData() {
  try {
    const url =
      "https://www.moneycontrol.com/stocks/marketstats/fii_dii_activity/index.php";
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const data = [];
    $(".mctable1 tbody tr").each((index, element) => {
      const row = $(element)
        .find("td")
        .map((i, td) => $(td).text().trim().replace(/\s+/g, " ")) // Clean spaces
        .get();

      // Extract only valid date rows
      if (row.length >= 7 && /\d{2}-[A-Za-z]+-\d{4}/.test(row[0])) {
        const cleanDate = row[0].split(/\s+/)[0]; // Avoid repetition

        data.push({
          date: cleanDate,
          fii_buy: row[1],
          fii_sell: row[2],
          fii_net: row[3],
          dii_buy: row[4],
          dii_sell: row[5],
          dii_net: row[6],
        });
      }
    });

    for (const entry of data) {
      const existing = await FiiDiiData.findOne({ date: entry.date });

      if (!existing) {
        await FiiDiiData.create(entry);
        console.log(`Saved: ${entry.date}`);
      } else {
        console.log(`Skipped (already exists): ${entry.date}`);
      }
    }

    console.log("Scraping and saving complete.");

    // const FiiDiiRes = await FiiDiiData.find();
    // if (!FiiDiiRes) {
    //   console.log("No data found");
    // }
    // console.log(FiiDiiRes, "FiiDiiRes");
  } catch (error) {
    console.error("Error scraping or saving data:", error);
  }
}

export default scrapeAndSaveFIIDIIData;
