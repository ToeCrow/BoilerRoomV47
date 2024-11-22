// script.js
import { fetchNews } from "./scripts/search.js";

/* console.log(`API Key: ${API_KEY}`); */

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsContainer = document.getElementById("news-container");

// event listeners
searchButton.addEventListener("click", () => {
    
    const url = fetchNews(); // returns url

    displayNews(url); // todo - hämta nyheter, input variabel är url
});



export { searchInput, searchButton, newsContainer };