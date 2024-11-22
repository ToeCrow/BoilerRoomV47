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



// SEARCH NEWS function which returns url for fetch
function searchNews() {
    const query = searchInput.value + "&";
    const apiKey = API_KEY;
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


fetch(`https://newsapi.org/v2/top-headlines?country=SE&apiKey=${API_KEY}`)
.then(response => response.json())
.then(data => {
    const newsSection = document.getElementById("news-section");
    newsSection.innerHTML = "";
    data.articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");
        articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank">Läs mer</a>
        `;
        newsSection.appendChild(articleElement);
    });

});
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListeners("change", (event) => {
const selectedCategory = event.target.value;
const newsSection = document.getElementById("news-section");
newsSection.innerHTML = "";
});