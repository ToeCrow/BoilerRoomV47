import { API_KEY, API_KEY_GUARDIAN} from "./config.js";
const apiKey = API_KEY;
const apiKeyGuardian = API_KEY_GUARDIAN;
function getCategoryApiUrl(category, api) {
    if (api === "newsapi") {
        return `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
    } else if (api === "guardian") {
        return `https://content.guardianapis.com/search?section=${category}&page-size=10&api-key=${apiKeyGuardian}`; //max 10 articles
    }
    throw new Error(`Unsupported API: ${api}`);
}

function translateGuardianNews(data) {
    const translatedData = data.map((article) => ({
        title: article.webTitle,
        description: article.fields?.bodyText || "No description available.",
        name: "The Guardian",
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        image: article.fields?.thumbnail || "No image available",
        urlNews: article.webUrl,
    }));
    console.log("Translated Guardian articles:", translatedData);
    return translatedData;
}

export { getCategoryApiUrl, translateGuardianNews };