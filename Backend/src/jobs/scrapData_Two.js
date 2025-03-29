import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

async function scrapeFIIDIIData() {
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

      // Extract only valid date rows (ignoring empty or duplicate headers)
      if (row.length >= 7 && /\d{2}-[A-Za-z]+-\d{4}/.test(row[0])) {
        const dateParts = row[0].split(/\s+/); // Split date in case of duplication
        const cleanDate = dateParts[0]; // Pick only the first part to avoid repetition

        data.push({
          date: cleanDate, // Correctly formatted date without repetition
          fii_buy: row[1],
          fii_sell: row[2],
          fii_net: row[3],
          dii_buy: row[4],
          dii_sell: row[5],
          dii_net: row[6],
        });
      }
    });

    // Save only relevant data
    fs.writeFileSync("sdata.json", JSON.stringify(data, null, 2), "utf-8");

    console.log("Filtered data successfully saved in sdata.json.");
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

scrapeFIIDIIData();
