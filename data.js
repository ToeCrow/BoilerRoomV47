import { API_KEY, API_KEY_GUARDIAN} from "./config.js";
const apiKey = API_KEY;
const apiKeyGuardian = API_KEY_GUARDIAN;

function getCategoryApiUrl(category, api) {
    if (api === "newsapi") {
        return `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
    } else if (api === "guardian") {
        if (category === "entertainment") {
            let newCategory = "tv-and-radio";
            return `https://content.guardianapis.com/search?section=${newCategory}&page-size=10&api-key=${apiKeyGuardian}`; //max 10 articles

        } else {
            return `https://content.guardianapis.com/search?section=${category}&page-size=10&api-key=${apiKeyGuardian}`; //max 10 articles
        }
        
    }
    throw new Error(`Unsupported API: ${api}`);
}


function storeArticlesArrayInLocalStorage(articles, key) {
    localStorage.setItem(key, JSON.stringify(articles));
}

export { getCategoryApiUrl, storeArticlesArrayInLocalStorage }