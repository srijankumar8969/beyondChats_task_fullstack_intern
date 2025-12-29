import Article from "../models/Article.js";

export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createArticle = async (req, res) => {
    try{
    const { title, content, sourceUrl } = req.body;

    const existing = await Article.findOne({ sourceUrl });

    if (existing) {
        return res.status(200).json({
            message: "Article already exists, skipping",
        });
    }

    const article = await Article.create({
        title,
        content,
        sourceUrl,
    });

    res.status(201).json(article);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const updated = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const deleted = await Article.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json({ message: "Article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};