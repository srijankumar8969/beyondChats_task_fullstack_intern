import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const rewriteArticle = async (
    originalTitle,
    originalContent,
    references
) => {
const prompt = `
Given below are 3 links first one is the original one go and find its content, use the other two and go to them and using there content find a better content for the original one
ORIGINAL TITLE:
${originalTitle}

ORIGINAL ARTICLE:
${originalContent}

COMPETITOR ARTICLE 1:
${references[0]}

COMPETITOR ARTICLE 2:
${references[1]}

IMPORTANT RULES:
- Return ONLY the article content
- Do NOT include explanations
- Do NOT mention competitors
- Do NOT include references
- Do NOT include phrases like "here is the rewritten article"
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text.trim();
};
