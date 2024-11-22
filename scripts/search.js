// search.js
import { searchInput } from "../script.js";
import { API_KEY } from "../config.js";

// Funktion för att hämta och visa nyheter
function fetchNews() {
    const query = searchInput.value;
    const apiKey = API_KEY;
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

    console.log("apiKey: ", apiKey);
    console.log("query: ", query);
    console.log("url som returneras: ", url);
    

    return url;
};


export { fetchNews };