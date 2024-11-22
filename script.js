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
//insert din api key
const API_KEY = 'ec19788c6a6f48008d20c22404dea314'; 
//lägg in url du vill hämta data från
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

async function fetchNews(country = 'us', category = '', query = '') {
    try {
        const url = new URL(BASE_URL);
        url.searchParams.append('apiKey', API_KEY);
        url.searchParams.append('country', country);

        // Gör en GET-förfrågan
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fel vid hämtning: ${response.status}`);
        }

        // Parsar JSON-data
        const data = await response.json();

        console.log('Hämtade artiklar:', data.articles);
        
        return data.articles;

    } catch (error) {
        console.error('Ett fel uppstod vid hämtning av nyheter:', error);
        return []; 
    }
}

fetchNews()





const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", filterNews);
function filterNews(event) {

const selectedCategory = event.target.value;
let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;

console.log("filteredFetch: ", filteredFetch);
return filteredFetch
};
