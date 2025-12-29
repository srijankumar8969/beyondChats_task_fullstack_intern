import axios from "axios";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export const scrapeArticle = async (url) => {
    try {
        const { data } = await axios.get(url, { timeout: 8000 });
        const $ = cheerio.load(data);
        return $("article").text().trim();
    } catch {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });
        const content = await page.evaluate(() =>
            document.querySelector("article")?.innerText || ""
        );
        await browser.close();
        return content;
    }
};