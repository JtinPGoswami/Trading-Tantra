import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin()); // Enable stealth mode

async function scrapeTableData() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Correct way to set User-Agent in Playwright
    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    });

    await page.goto('https://www.moneycontrol.com/stocks/marketstats/fii_dii_activity/index.php', { waitUntil: 'domcontentloaded' ,timeout: 60000});

   

    await page.waitForTimeout(5000); // Wait for JavaScript to load
    await page.keyboard.press('PageDown'); // Scroll to trigger loading

    // console.log(await page.content()); // Print HTML to check for the table

    await page.waitForFunction(() => document.querySelector('table') !== null, { timeout: 60000 });

    const table = document.querySelector('table') 

    console.log('table',table)


    const tableData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('table tbody tr')).map(row =>
            Array.from(row.querySelectorAll('td')).map(col => col.innerText.trim())
        );
    });

    console.log("Scraped Table Data:", tableData);
    await browser.close();
}

scrapeTableData().catch(console.error);
