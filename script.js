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
const newsList = document.getElementById("news-list"); // ul element

const apiKey = API_KEY;

function searchNews() {
    const query = searchInput.value + "&";
    
/*     const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`; */
    const url = `https://newsapi.org/v2/everything?q=${query}apiKey=${apiKey}`;    

    console.log("apiKey: ", apiKey);
    console.log("query: ", query);
    console.log("url som returneras: ", url);
    

    return url;
}

function displayNews() {
    console.log(newsList);
    
    newsList.innerHTML = ""; // Clear existing news items

    const titel = "TEST Nyhetstitel"; // replace with actual input
    const description = "TEST Nyhetstext";
    const source = "TEST Nyhetkalla";
    const date = "2024-01-01T00:00:00Z";

    createNewsElement( // calls function to create new element based on input values
      titel,
      description,
      source,
      date
    );

/*     news.forEach((article) => {
      createNewsElement(
        article.title,
        article.description,
        article.source.name,
        article.publishedAt
      );
    }); */

}

  function createNewsElement(title, description, source, date) {
    const newsItem = document.createElement("li");
    newsItem.classList.add("news-item");
  
    const newsTitle = document.createElement("h2");
    newsTitle.classList.add("news-title");
    newsTitle.textContent = title;
  
    const newsDescription = document.createElement("p");
    newsDescription.classList.add("news-description");
    newsDescription.textContent = description;
  
    const newsSource = document.createElement("small");
    newsSource.classList.add("news-source");
    newsSource.textContent = source;
  
    const newsDate = document.createElement("small");
    newsDate.classList.add("news-date");
    newsDate.textContent = formatDate(date);
  
    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDescription);
    newsItem.appendChild(newsSource);
    newsItem.appendChild(newsDate);
  
    newsList.appendChild(newsItem);
}

// SEARCH NEWS function which returns url for fetch


// event listener search
searchButton.addEventListener("click", () => {
    
    const url = searchNews(); // returns url

    //! byt namn på function till rätt
    getNews(url); //todo gustavs funktion vad-den-nu-heter */

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

    })
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    const newsSection = document.getElementById("news-section");
    newsSection.innerHTML = "";
});try {
  // code that might throw an error
} catch (error) {
  // code to handle the error
}


