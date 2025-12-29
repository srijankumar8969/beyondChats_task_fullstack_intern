import puppeteer from "puppeteer";
import axios from "axios";

const BASE_URL = "https://beyondchats.com";
const BLOGS_URL = `${BASE_URL}/blogs`;
const API_URL = "http://localhost:5000/articles";

const scrapeBeyondChats = async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    console.log("Opening blogs page...");
    await page.goto(BLOGS_URL, { waitUntil: "networkidle2" });

    const totalPages = await page.evaluate(() => {
        const pageNumbers = Array.from(
            document.querySelectorAll(".page-numbers")
        )
            .map(el => parseInt(el.innerText))
            .filter(Boolean);

        return pageNumbers.length ? Math.max(...pageNumbers) : 1;
    });

    console.log("Total pages found:", totalPages);

    const blogMeta = [];

    for (let i = 1; i <= totalPages; i++) {
        const pageUrl =
            i === 1
                ? BLOGS_URL
                : `${BLOGS_URL}/page/${i}`;

        console.log("Visiting:", pageUrl);
        await page.goto(pageUrl, { waitUntil: "networkidle2" });

        const blogsOnPage = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("article.entry-card"))
                .map(card => {
                    const link = card.querySelector(".entry-title a")?.href;
                    const datetime = card
                        .querySelector("time.ct-meta-element-date")
                        ?.getAttribute("datetime");

                    if (!link || !datetime) return null;

                    return {
                        url: link,
                        date: new Date(datetime).getTime(),
                    };
                })
                .filter(Boolean);
        });

        blogMeta.push(...blogsOnPage);
    }

    const oldestFive = blogMeta
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);

    console.log(
        "Oldest blogs selected:",
        oldestFive.map(b => b.url)
    );

    for (const blog of oldestFive) {
        console.log("Scraping article:", blog.url);

        await page.goto(blog.url, { waitUntil: "networkidle2" });

        const article = await page.evaluate(() => {
            const title = document.querySelector("h1")?.innerText || "";
            const content =
                document.querySelector("article")?.innerText || "";

            return { title, content };
        });

        if (!article.title || !article.content) {
            console.log("Skipping empty article");
            continue;
        }

        await axios.post(API_URL, {
            title: article.title,
            content: article.content,
            sourceUrl: blog.url,
        });

        console.log("Saved:", article.title);
    }

    await browser.close();
    console.log("Scraping completed");
};

scrapeBeyondChats();
