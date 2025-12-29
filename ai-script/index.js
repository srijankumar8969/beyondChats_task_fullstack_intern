import "dotenv/config"
import { fetchArticles } from "./fetchArticles.js";
import { googleSearch } from "./googleSearch.js";
import { scrapeArticle } from "./scrapeArticle.js";
import { rewriteArticle } from "./llm.js";
import { updateArticle } from "./publishArticle.js";

const runPhase2 = async () => {
    console.log("📥 Fetching articles from DB...");
    const articles = await fetchArticles();

    const article = articles[0]; 
    console.log("📝 Using article:", article.title);

    console.log("🔍 Google searching...");
    const references = await googleSearch(article.title);

    console.log("🌐 Scraping competitors...");
    console.log("🤖 Rewriting article with LLM...");
    const rewrittenContent = await rewriteArticle(
        article.title,
        article.content,
        references
    );

    console.log("🚀 Updating article...");
    await updateArticle(article._id, rewrittenContent, references);

    console.log("✅ Phase 2 completed successfully");
};

runPhase2();
