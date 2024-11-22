// script.js
import { API_KEY } from "./config.js";

/* console.log(`API Key: ${API_KEY}`); */

// Funktion för att formatera timestamp (svenskt datumformat utan sekunder)
//! kolla så paramertern stämmer
function formatDate(timestamp) {
 const date = new Date(timestamp);
 const options = {
   weekday: 'short',
   year: 'numeric',
   month: 'short',
   day: 'numeric',
   hour: 'numeric',
   minute: 'numeric',
   hour12: false
 };
 return date.toLocaleString('sv-SE', options);
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsContainer = document.getElementById("news-container");

const apiKey = API_KEY;

// SEARCH NEWS function which returns url for fetch
function searchNews() {
    const query = searchInput.value + "&";
    
/*     const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`; */
    const url = `https://newsapi.org/v2/everything?q=${query}apiKey=${apiKey}`;    

    console.log("apiKey: ", apiKey);
    console.log("query: ", query);
    console.log("url som returneras: ", url);
    

    return url;
};

// event listener search
searchButton.addEventListener("click", () => {
    
    const url = searchNews(); // returns url

    //! todo - byt namn på function till rätt
    fetchFunktion(url); //todo gustavs funktion vad-den-nu-heter

    displayNews(); // todo - byt namn på function till rätt - hämta nyheter, input från gustavs fetchFunktion
});


const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", filterNews);
function filterNews(event) {

const selectedCategory = event.target.value;
let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;

console.log("filteredFetch: ", filteredFetch);
return filteredFetch
};
