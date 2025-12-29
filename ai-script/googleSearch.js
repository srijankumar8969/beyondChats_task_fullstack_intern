import { getJson } from "serpapi";

export const googleSearch = async (title) => {
    const userObj = await new Promise((resolve, reject) => {
        getJson(
            {
                q: title,
                location: "Austin, Texas, United States",
                hl: "en",
                gl: "us",
                google_domain: "google.com",
                api_key: process.env.SERP_API_KEY,
            },
            (json) => {
                if (!json) {
                    reject("No response from SerpAPI");
                } else {
                    resolve(json);
                }
            }
        );
    });

    console.log(userObj.organic_results[1].link);

    return [
        userObj.organic_results[1].link,
        userObj.organic_results[2].link,
    ];
};
