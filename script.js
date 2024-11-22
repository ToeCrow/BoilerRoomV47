// script.js
import { fetchNews } from "./scripts/search.js";

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

// event listener search
searchButton.addEventListener("click", () => {
    
    const url = fetchNews(); // returns url

    fetchFunktion(url); //todo gustavs funktion vad-den-nu-heter

    displayNews(); // todo - byt namn på function till rätt - hämta nyheter, input från gustavs fetchFunktion
});



export { searchInput, searchButton, newsContainer };